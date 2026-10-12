import type { ReactNode } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import Prose from './Prose';
import { tagHref } from '../data/posts';

export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

interface PostLink {
  href: string;
  title: string;
}

interface Props {
  title: string;
  date: string;
  dateISO: string;
  updated?: string | undefined;
  updatedISO?: string | undefined;
  minutes: number;
  tags: string[];
  /** Shown beside the article on wide screens; empty hides the sidebar. */
  toc: TocHeading[];
  older?: PostLink | undefined;
  newer?: PostLink | undefined;
  children?: ReactNode;
}

export const articleMaxWidth = 712;

export default function PostArticle(props: Props) {
  const { title, date, dateISO, updated, updatedISO, minutes, tags, toc, older, newer } = props;
  return (
    <ThemeRoot>
      <Box
        sx={{
          display: 'grid',
          justifyContent: 'center',
          columnGap: 6,
          gridTemplateColumns: {
            xs: `minmax(0, ${articleMaxWidth}px)`,
            lg: toc.length > 0 ? `minmax(0, ${articleMaxWidth}px) 220px` : undefined,
          },
        }}
      >
        <Box component="article" sx={{ minWidth: 0 }}>
          <Box component="header" sx={{ mb: 4 }}>
            <Typography variant="h1">{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              <time dateTime={dateISO}>{date}</time>
              {updated && updatedISO && (
                <>
                  {' · 更新於 '}
                  <time dateTime={updatedISO}>{updated}</time>
                </>
              )}
              {` · 約 ${minutes} 分鐘`}
            </Typography>
            {tags.length > 0 && (
              <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    component="a"
                    href={tagHref(tag)}
                    clickable
                    size="small"
                    variant="outlined"
                    label={`#${tag}`}
                  />
                ))}
              </Stack>
            )}
          </Box>
          <Prose>{props.children}</Prose>
          {(older || newer) && (
            <Box
              component="nav"
              aria-label="其他文章"
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
                mt: 8,
                pt: 4,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Box>
                {older && (
                  <Button href={older.href} startIcon={<ArrowBack />} sx={{ textAlign: 'left' }}>
                    <span>
                      <Typography
                        variant="caption"
                        component="span"

                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        上一篇
                      </Typography>
                      {older.title}
                    </span>
                  </Button>
                )}
              </Box>
              <Box sx={{ textAlign: { sm: 'right' } }}>
                {newer && (
                  <Button href={newer.href} endIcon={<ArrowForward />} sx={{ textAlign: 'right' }}>
                    <span>
                      <Typography
                        variant="caption"
                        component="span"

                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        下一篇
                      </Typography>
                      {newer.title}
                    </span>
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
        {toc.length > 0 && (
          <Box
            component="nav"
            aria-label="文章目錄"
            sx={{
              display: { xs: 'none', lg: 'block' },
              position: 'sticky',
              top: 96,
              alignSelf: 'start',
              maxHeight: 'calc(100vh - 128px)',
              overflowY: 'auto',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              目錄
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {toc.map((heading) => (
                <Box
                  component="li"
                  key={heading.slug}
                  sx={{ pl: (heading.depth - 2) * 1.5, py: 0.5 }}
                >
                  <Link href={`#${heading.slug}`} variant="body2" color="text.secondary">
                    {heading.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </ThemeRoot>
  );
}
