export interface BannerLink {
    type: 'product' | 'search';
    slug?: string;  // For product type
    keyword?: string;  // For search type
}

export const bannerLinks: Record<string, BannerLink> = {
    // Main slider banners
    banner: { type: 'search', keyword: 'iphone' },
    homeBanner5: { type: 'product', slug: 'nubia-neo-3-4g' },
    homeBanner6: { type: 'product', slug: 'poco-f8-pro' },
    iphoneBanner: { type: 'search', keyword: 'iphone' },
    banner1: { type: 'product', slug: 'iPhone-17-Pro' },
    banner2: { type: 'product', slug: 'samsung-galaxy-s25-ultra' },

    // Right side banners
    homeBanner1: { type: 'search', keyword: 'iphone' },
    homeBanner2: { type: 'search', keyword: 'samsung' },
    banner3: { type: 'search', keyword: 'samsung' },


};
