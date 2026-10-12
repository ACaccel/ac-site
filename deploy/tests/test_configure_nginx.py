import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "configure_nginx", Path(__file__).resolve().parent.parent / "configure-nginx.py"
)
assert spec and spec.loader
configure = importlib.util.module_from_spec(spec)
spec.loader.exec_module(configure)

SITE = """server {
    listen 192.0.2.10:80;
    server_name acserver.csie.org;
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/acme;
    }
    location / { return 404; }

# other-app managed route BEGIN http
    include /etc/nginx/snippets/other-app-http.conf;
# other-app managed route END http
}

server {
    listen 192.0.2.10:443 ssl;
    server_name acserver.csie.org;
    # A brace in a comment { must not confuse block parsing.
    location / { return 404; }

# other-app managed route BEGIN https
    include /etc/nginx/snippets/other-app.conf;
# other-app managed route END https
}
"""

OTHER_HOST = """server {
    listen 192.0.2.10:443 ssl;
    server_name example.test;
    location / { return 404; }
}
"""


def http_block(site: str) -> str:
    return site.split("\n}\n", 1)[0]


def https_block(site: str) -> str:
    return site.split("\n}\n", 1)[1]


class UpdateSiteTest(unittest.TestCase):
    def test_deploy_replaces_placeholders_in_each_protocol(self) -> None:
        result = configure.update_site(SITE, "deploy")
        self.assertIn("include /etc/nginx/snippets/acaccel-site-http.conf;", http_block(result))
        self.assertIn("include /etc/nginx/snippets/acaccel-site.conf;", https_block(result))
        self.assertNotIn("location / { return 404; }", result)
        self.assertIn("include /etc/nginx/snippets/other-app.conf;", result)

    def test_deploy_migrates_blocks_of_the_former_name(self) -> None:
        current = configure.update_site(SITE, "deploy")
        legacy = current.replace("acaccel-site", "ac-site")
        self.assertIn("# ac-site managed route BEGIN https", legacy)
        self.assertEqual(configure.update_site(legacy, "deploy"), current)
        self.assertEqual(configure.update_site(legacy, "remove"), SITE)

    def test_deploy_is_idempotent(self) -> None:
        once = configure.update_site(SITE, "deploy")
        self.assertEqual(configure.update_site(once, "deploy"), once)

    def test_remove_restores_the_original(self) -> None:
        deployed = configure.update_site(SITE, "deploy")
        self.assertEqual(configure.update_site(deployed, "remove"), SITE)
        self.assertEqual(configure.update_site(SITE, "remove"), SITE)

    def test_other_hosts_are_untouched(self) -> None:
        result = configure.update_site(SITE + "\n" + OTHER_HOST, "deploy")
        self.assertTrue(result.endswith(OTHER_HOST))

    def test_rejects_a_customized_root_location(self) -> None:
        site = SITE.replace(
            "    location / { return 404; }\n\n# other-app managed route BEGIN https",
            "    location / { proxy_pass http://127.0.0.1:9; }\n\n"
            "# other-app managed route BEGIN https",
        )
        with self.assertRaisesRegex(configure.ConfigError, "https server"):
            configure.update_site(site, "deploy")

    def test_rejects_an_extra_root_location_next_to_the_managed_block(self) -> None:
        deployed = configure.update_site(SITE, "deploy")
        site = deployed.replace(
            "server_name acserver.csie.org;\n    # A brace",
            "server_name acserver.csie.org;\n    location / { return 403; }\n    # A brace",
        )
        with self.assertRaisesRegex(configure.ConfigError, "Another root location"):
            configure.update_site(site, "deploy")

    def test_rejects_duplicate_servers_for_one_protocol(self) -> None:
        with self.assertRaisesRegex(configure.ConfigError, "Multiple https"):
            configure.update_site(SITE + https_block(SITE), "deploy")

    def test_requires_both_protocols(self) -> None:
        with self.assertRaisesRegex(configure.ConfigError, "http"):
            configure.update_site(https_block(SITE), "deploy")

    def test_rejects_unbalanced_braces(self) -> None:
        with self.assertRaises(configure.ConfigError):
            configure.update_site(SITE + "server {\n", "deploy")


if __name__ == "__main__":
    unittest.main()
