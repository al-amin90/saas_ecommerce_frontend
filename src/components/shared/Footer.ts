import {
  Box, Container, Grid, Typography, IconButton,
  Divider, Link, TextField, Button
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const footerLinks = {
  Shop: ['New Arrivals', 'Running Shoes', 'Casual Shoes', 'Boots', 'Heels & Pumps', 'Sandals', 'Sale'],
  Help: ['My Account', 'Track Order', 'Returns & Exchanges', 'Shipping Policy', 'Size Guide', 'FAQ'],
  Company: ['About Us', 'Careers', 'Press', 'Sustainability', 'Affiliates', 'Blog'],
};

export default function Footer() {
  return (
    <Box sx={{ background: '#111111', color: '#FFFFFF' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={5}>
          {/* Brand column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  background: '#C8A97E',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: '#1A1A1A', fontSize: '1.1rem', fontWeight: 800 }}>S</Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
              >
                SOLE<span style={{ color: '#C8A97E' }}>CRAFT</span>
              </Typography>
            </Box>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.88rem',
                lineHeight: 1.8,
                mb: 3,
                maxWidth: 300,
              }}
            >
              Bangladesh's premier destination for authentic international footwear. Quality, style, and comfort delivered to your door.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
              {[
                { icon: <PhoneIcon sx={{ fontSize: 16 }} />, text: '+880 1700-000000' },
                { icon: <EmailIcon sx={{ fontSize: 16 }} />, text: 'hello@solecraft.com.bd' },
                { icon: <LocationOnIcon sx={{ fontSize: 16 }} />, text: 'Dhanmondi, Dhaka 1209' },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: '#C8A97E', flexShrink: 0 }}>{item.icon}</Box>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: '0.82rem',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Social icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <FacebookIcon fontSize="small" />, label: 'Facebook' },
                { icon: <InstagramIcon fontSize="small" />, label: 'Instagram' },
                { icon: <TwitterIcon fontSize="small" />, label: 'Twitter' },
                { icon: <YouTubeIcon fontSize="small" />, label: 'YouTube' },
              ].map((s) => (
                <IconButton
                  key={s.label}
                  aria-label={s.label}
                  size="small"
                  sx={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                    borderRadius: '2px',
                    '&:hover': { background: '#C8A97E', color: '#1A1A1A' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid item xs={6} sm={4} md={2} key={title}>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  mb: 2.5,
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    underline="none"
                    sx={{
                      color: 'rgba(255,255,255,0.45)',
                      fontSize: '0.82rem',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'color 0.2s ease',
                      '&:hover': { color: '#C8A97E' },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Bottom bar */}
      <Container maxWidth="xl">
        <Box
          sx={{
            py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '0.75rem',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            © 2025 SoleCraft Bangladesh. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.72rem',
                  fontFamily: "'DM Sans', sans-serif",
                  '&:hover': { color: '#C8A97E' },
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
          {/* Payment methods */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {['bKash', 'Nagad', 'VISA', 'MasterCard'].map((method) => (
              <Box
                key={method}
                sx={{
                  px: 1,
                  py: 0.3,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '2px',
                  fontSize: '0.62rem',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.05em',
                }}
              >
                {method}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}