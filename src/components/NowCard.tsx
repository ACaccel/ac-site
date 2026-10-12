import ArrowForward from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { around, text } from '../data/text';

export interface NowSummary {
  summary: string;
  updated: string;
  updatedISO: string;
}

/** Homepage teaser for the Now page; render inside a ThemeRoot. */
export default function NowCard({ now }: { now: NowSummary }) {
  const updatedText = around(text.home.now.updated, 'date');
  return (
    <Card component="section" aria-labelledby="now-heading">
      <CardContent sx={{ p: 3 }}>
        <Typography variant="overline" color="primary" component="h2" id="now-heading">
          {text.home.now.title}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: '1.0625rem' }}>{now.summary}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          {updatedText[0]}
          <time dateTime={now.updatedISO}>{now.updated}</time>
          {updatedText[1]}
        </Typography>
        <Button
          href="/now/"
          size="small"
          endIcon={<ArrowForward fontSize="small" />}
          sx={{ mt: 1.5, ml: -1 }}
        >
          {text.home.now.more}
        </Button>
      </CardContent>
    </Card>
  );
}
