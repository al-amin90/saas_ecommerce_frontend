import { Box, Container, Typography } from '@mui/material';

const brandLogos = [
  { name: 'Nike', style: { fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.02em' } },
  { name: 'Adidas', style: { fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.1em' } },
  { name: 'New Balance', style: { fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em' } },
  { name: 'Timberland', style: { fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.08em' } },
  { name: 'Vans', style: { fontWeight: 900, fontSize: '1.8rem', letterSpacing: '0.15em' } },
  { name: 'Clarks', style: { fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.05em' } },
  { name: 'Birkenstock', style: { fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.12em' } },
  { name: 'Skechers', style: { fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.05em' } },
];

export default function BrandsSection() {
  return (
    <Box id="brands" sx={{ py: { xs: 5, md: 7 }, background: '#F7F6F2', overflow: 'hidden' }}>
      <Container maxWidth="xl">
        <Typography
          sx={{
            textAlign: 'center',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#B0B0B0',
            mb: 4,
          }}
        >
          Our Premium Brand Partners
        </Typography>
      </Container>

      {/* Infinite scroll marquee */}
      <Box
        sx={{
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 80,
            zIndex: 1,
          },
          '&::before': {
            left: 0,
            background: 'linear-gradient(to right, #F7F6F2, transparent)',
          },
          '&::after': {
            right: 0,
            background: 'linear-gradient(to left, #F7F6F2, transparent)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            animation: 'marquee 20s linear infinite',
            '@keyframes marquee': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
            whiteSpace: 'nowrap',
          }}
        >
          {[...brandLogos, ...brandLogos].map((brand, i) => (
            <Typography
              key={i}
              sx={{
                ...brand.style,
                color: '#D0CFC8',
                fontFamily: "'Syne', sans-serif",
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
                cursor: 'pointer',
                userSelect: 'none',
                '&:hover': { color: '#C8A97E' },
                flexShrink: 0,
              }}
            >
              {brand.name}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}