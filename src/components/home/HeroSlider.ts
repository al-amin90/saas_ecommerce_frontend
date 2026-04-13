import { useEffect, useRef } from 'react';
import { Box, Typography, Button, Container, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


export default function HeroSlider() {
  const swiperRef = useRef(null);

  useEffect(() => {
    const loadSwiper = async () => {
      if (typeof window !== 'undefined') {
        const { default: Swiper } = await import('swiper');
        const { Pagination, Autoplay, EffectFade } = await import('swiper/modules');

        new Swiper(swiperRef.current, {
          modules: [Pagination, Autoplay, EffectFade],
          effect: 'fade',
          loop: true,
          autoplay: { delay: 5000, disableOnInteraction: false },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });
      }
    };
    loadSwiper();
  }, []);

  return (
    <Box
      ref={swiperRef}
      className="swiper hero-swiper"
      sx={{ position: 'relative', height: { xs: '70vh', md: '88vh' }, overflow: 'hidden' }}
    >
      <Box className="swiper-wrapper">
        {heroSlides.map((slide) => (
          <Box
            key={slide.id}
            className="swiper-slide"
            sx={{
              background: slide.bg,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background shoe image */}
            <Box
              sx={{
                position: 'absolute',
                right: { xs: '-5%', md: '5%' },
                bottom: { xs: '-5%', md: '-8%' },
                width: { xs: '70%', md: '50%' },
                maxWidth: 700,
                height: '85%',
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right bottom',
                opacity: 0.9,
                filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.4))',
                transition: 'transform 8s ease',
                transform: 'scale(1.02)',
              }}
            />

            {/* Gradient overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)`,
              }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ maxWidth: { xs: '100%', md: '55%' } }}>
                <Chip
                  label={slide.tag}
                  size="small"
                  sx={{
                    background: slide.accent,
                    color: '#1A1A1A',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    mb: 3,
                    height: 26,
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{
                    color: slide.accent,
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    mb: 1.5,
                  }}
                >
                  {slide.subtitle}
                </Typography>

                <Typography
                  variant="h1"
                  sx={{
                    color: '#FFFFFF',
                    fontSize: { xs: '2.8rem', sm: '3.5rem', md: '5rem', lg: '6rem' },
                    lineHeight: 1.0,
                    mb: 3,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {slide.title}
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: { xs: '0.9rem', md: '1.05rem' },
                    mb: 4,
                    maxWidth: 420,
                    lineHeight: 1.7,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {slide.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: slide.accent,
                      color: '#1A1A1A',
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      '&:hover': {
                        background: '#FFFFFF',
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 30px rgba(200,169,126,0.4)`,
                      },
                    }}
                  >
                    {slide.cta}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.4)',
                      color: '#FFFFFF',
                      px: 4,
                      py: 1.5,
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      '&:hover': {
                        borderColor: '#FFFFFF',
                        background: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    View All
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
        ))}
      </Box>

      <Box
        className="swiper-pagination"
        sx={{
          bottom: '30px !important',
          left: { xs: '50%', md: '80px' },
          transform: { xs: 'translateX(-50%)', md: 'none' },
          width: 'auto !important',
        }}
      />
    </Box>
  );
}