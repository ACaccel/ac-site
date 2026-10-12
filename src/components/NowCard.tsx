import ArrowForward from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export interface NowSummary {
  summary: string;
  updated: string;
  updatedISO: string;
}

/** Homepage teaser for the Now page; render inside a ThemeRoot. */
export default function NowCard({ now }: { now: NowSummary }) {
  return (
    <Card component="section" aria-labelledby="now-heading">
      <CardContent sx={{ p: 3 }}>
        <Typography variant="overline" color="primary" component="h2" id="now-heading">
          近況
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: '1.0625rem' }}>{now.summary}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          更新於 <time dateTime={now.updatedISO}>{now.updated}</time>
        </Typography>
        <Button
          href="/now/"
          size="small"
          endIcon={<ArrowForward fontSize="small" />}
          sx={{ mt: 1.5, ml: -1 }}
        >
          看更多近況
        </Button>
      </CardContent>
    </Card>
  );
}
