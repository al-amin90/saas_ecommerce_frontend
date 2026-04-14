import { Box, Container, Typography, Grid, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const categoryBanners = [
  {
    title: "Men's",
    subtitle: '240+ Styles',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    bg: '#1A1A1A',
    span: 2,
  },
  {
    title: "Women's",
    subtitle: '180+ Styles',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    bg: '#2C2C2C',
    span: 1,
  },
  {
    title: 'Running',
    subtitle: 'Performance Gear',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    bg: '#1C1412',
    span: 1,
  },
  {
    title: 'Boots',
    subtitle: 'Winter Ready',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80',
    bg: '#2D1F14',
    span: 1,
  },
];

export default function CategoryBanners() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, background: '#F7F6F2' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C8A97E',
              mb: 1.5,
            }}
          >
            Browse by Category
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            Find Your Perfect Pair
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Large banner */}
          <Grid item xs={12} md={6}>
            <CategoryBannerCard banner={categoryBanners[0]} height={480} />
          </Grid>

          {/* Right side stacked */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {categoryBanners.slice(1).map((banner, i) => (
                <Grid item xs={12} sm={6} key={i} sx={{ height: { xs: 200, md: 'auto' } }}>
                  <CategoryBannerCard banner={banner} height="100%" minHeight={220} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function CategoryBannerCard({ banner, height, minHeight }) {
  return (
    <Box
      sx={{
        height: height,
        minHeight: minHeight || 'auto',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        '&:hover img': { transform: 'scale(1.06)' },
        '&:hover .cta-btn': { opacity: 1, transform: 'translateY(0)' },
      }}
    >
      <Box
        component="img"
        src={banner.image}
        alt={banner.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s ease',
          display: 'block',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 3,
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.72rem',
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            mb: 0.5,
          }}
        >
          {banner.subtitle}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: '#FFFFFF',
            fontSize: { xs: '1.8rem', md: '2rem' },
            fontWeight: 800,
            letterSpacing: '-0.02em',
            mb: 2,
          }}
        >
          {banner.title}
        </Typography>
        <Button
          className="cta-btn"
          endIcon={<ArrowForwardIcon />}
          sx={{
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.5)',
            background: 'transparent',
            px: 2.5,
            py: 0.8,
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            width: 'fit-content',
            opacity: { xs: 1, md: 0 },
            transform: { xs: 'none', md: 'translateY(8px)' },
            transition: 'all 0.3s ease',
            '&:hover': { background: '#C8A97E', borderColor: '#C8A97E' },
          }}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
}