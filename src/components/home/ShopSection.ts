import { useState } from 'react';
import {
  Box, Container, Typography, Grid, Tabs, Tab,
  FormControl, Select, MenuItem, InputLabel,
  Chip, Slider, Button, Drawer, IconButton,
  Divider, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ProductCard from './ProductCard';
import { products, categories, brands } from '../data/products';

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const filteredProducts = products
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'new') return b.isNew - a.isNew;
      return 0;
    });

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <Box id="shop" sx={{ py: { xs: 6, md: 10 }, background: '#FAFAF8' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C8A97E',
              mb: 1.5,
            }}
          >
            Our Collection
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 800,
              letterSpacing: '-0.03em',
              mb: 2,
            }}
          >
            Shop All Shoes
          </Typography>
          <Typography
            sx={{
              color: '#6B6B6B',
              maxWidth: 480,
              mx: 'auto',
              fontSize: '1rem',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Premium footwear for every occasion, style, and stride.
          </Typography>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ borderBottom: '1px solid #EBEBEB', mb: 4 }}>
          <Tabs
            value={activeCategory}
            onChange={(e, v) => setActiveCategory(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 44 }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat.id}
                value={cat.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Box>
                }
                sx={{
                  minHeight: 44,
                  fontSize: '0.72rem',
                  '&.Mui-selected': { color: '#1A1A1A' },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Toolbar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              startIcon={<FilterListIcon />}
              variant="outlined"
              size="small"
              onClick={() => setFilterOpen(true)}
              sx={{ fontSize: '0.75rem', borderColor: '#EBEBEB' }}
            >
              Filters
            </Button>
            {selectedBrands.length > 0 && (
              <Chip
                label={`${selectedBrands.length} brand${selectedBrands.length > 1 ? 's' : ''}`}
                size="small"
                onDelete={() => setSelectedBrands([])}
                sx={{ fontSize: '0.7rem' }}
              />
            )}
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#6B6B6B',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {filteredProducts.length} products
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel sx={{ fontSize: '0.8rem', fontFamily: "'Syne', sans-serif" }}>
              Sort By
            </InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif" }}
            >
              <MenuItem value="featured" sx={{ fontSize: '0.8rem' }}>Featured</MenuItem>
              <MenuItem value="new" sx={{ fontSize: '0.8rem' }}>New Arrivals</MenuItem>
              <MenuItem value="price-asc" sx={{ fontSize: '0.8rem' }}>Price: Low to High</MenuItem>
              <MenuItem value="price-desc" sx={{ fontSize: '0.8rem' }}>Price: High to Low</MenuItem>
              <MenuItem value="rating" sx={{ fontSize: '0.8rem' }}>Top Rated</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Product Grid */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
          {filteredProducts.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "'Syne', sans-serif", color: '#6B6B6B', mb: 2 }}
                >
                  No products found
                </Typography>
                <Button variant="outlined" onClick={() => { setSelectedBrands([]); setPriceRange([0, 10000]); }}>
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 6, py: 1.5, borderColor: '#1A1A1A', minWidth: 200 }}
            >
              Load More
            </Button>
          </Box>
        )}
      </Container>

      {/* Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{ sx: { width: 300, p: 3 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
          >
            Filters
          </Typography>
          <IconButton size="small" onClick={() => setFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Price Range */}
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            mb: 2,
          }}
        >
          Price Range
        </Typography>
        <Box sx={{ px: 1, mb: 1 }}>
          <Slider
            value={priceRange}
            onChange={(e, v) => setPriceRange(v)}
            min={0}
            max={10000}
            step={500}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `৳${v.toLocaleString()}`}
            sx={{ color: '#C8A97E' }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography sx={{ fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif" }}>
            ৳{priceRange[0].toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif" }}>
            ৳{priceRange[1].toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Brands */}
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            mb: 2,
          }}
        >
          Brands
        </Typography>
        <FormGroup>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  size="small"
                  sx={{ '&.Mui-checked': { color: '#C8A97E' } }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
                  {brand}
                </Typography>
              }
            />
          ))}
        </FormGroup>

        <Box sx={{ mt: 4, display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => { setSelectedBrands([]); setPriceRange([0, 10000]); }}
            sx={{ fontSize: '0.75rem' }}
          >
            Clear All
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setFilterOpen(false)}
            sx={{ fontSize: '0.75rem' }}
          >
            Apply
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}