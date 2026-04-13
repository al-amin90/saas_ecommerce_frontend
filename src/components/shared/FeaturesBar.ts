import { Box, Container, Grid, Typography } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';

const features = [
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 32 }} />,
    title: 'Free Delivery',
    desc: 'On orders above ৳3,000. Fast and reliable nationwide shipping.',
  },
  {
    icon: <CachedOutlinedIcon sx={{ fontSize: 32 }} />,
    title: 'Easy Returns',
    desc: '30-day hassle-free returns. No questions asked.',
  },
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 32 }} />,
    title: '100% Authentic',
    desc: 'All products are 100% original and quality guaranteed.',
  },
  {
    icon: <HeadsetMicOutlinedIcon sx={{ fontSize: 32 }} />,
    title: '24/7 Support',
    desc: 'Our team is always ready to help you anytime.',
  },
];

export default function FeaturesBar() {
  return (
    <Box sx={{ background: '#1A1A1A', py: { xs: 5, md: 6 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 1,
                  borderLeft: i !== 0 ? { md: '1px solid rgba(255,255,255,0.1)' } : 'none',
                  pl: i !== 0 ? { md: 4 } : 1,
                }}
              >
                <Box sx={{ color: '#C8A97E', mt: 0.3, flexShrink: 0 }}>{f.icon}</Box>
                <Box>
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      mb: 0.5,
                    }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: '0.82rem',
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    {f.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}