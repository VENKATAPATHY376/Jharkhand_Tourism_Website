// Mock data for when API is not accessible
export const mockPackages = [
  {
    id: 1,
    title: "Dassam Falls Adventure",
    description: "Experience the majestic Dassam Falls with adventure activities",
    type: "adventure",
    duration: 2,
    price: 2999.00,
    discounted_price: 2499.00,
    featured: true,
    rating: 4.8,
    review_count: 245,
    location: "Ranchi, Jharkhand",
    includes: ["Transportation", "Guide", "Meals", "Photography"],
    difficulty: "Moderate",
    images: ["/assets/Falls.jpg"]
  },
  {
    id: 2,
    title: "Jharkhand Cultural Festival",
    description: "Immerse yourself in the rich cultural heritage of Jharkhand",
    type: "cultural",
    duration: 1,
    price: 1999.00,
    discounted_price: 1699.00,
    featured: true,
    rating: 4.7,
    review_count: 189,
    location: "Ranchi, Jharkhand",
    includes: ["Cultural shows", "Traditional lunch", "Handicraft workshop"],
    difficulty: "Easy",
    images: ["/assets/Festival.jpg"]
  },
  {
    id: 3,
    title: "Authentic Jharkhand Cuisine Tour",
    description: "Discover the flavors of traditional Jharkhand cuisine",
    type: "culinary",
    duration: 3,
    price: 3999.00,
    discounted_price: 3399.00,
    featured: true,
    rating: 4.9,
    review_count: 156,
    location: "Multiple Cities, Jharkhand",
    includes: ["Cooking classes", "Local markets", "Traditional restaurants"],
    difficulty: "Easy",
    images: ["/assets/Food.jpg"]
  },
  {
    id: 4,
    title: "Hidden Trails of Jharkhand",
    description: "Explore the unexplored trails and hidden gems",
    type: "adventure",
    duration: 4,
    price: 4999.00,
    discounted_price: 4299.00,
    featured: true,
    rating: 4.8,
    review_count: 203,
    location: "Netarhat, Jharkhand",
    includes: ["Accommodation", "All meals", "Local transport"],
    difficulty: "Moderate",
    images: ["/assets/Hiddentrail.avif"]
  }
];

export const mockDestinations = [
  {
    id: 1,
    name: "Ranchi",
    description: "Capital city with modern amenities and natural beauty",
    attractions: ["Rock Garden", "Tagore Hill", "Kanke Dam"],
    image: "/assets/image.png"
  },
  {
    id: 2,
    name: "Netarhat",
    description: "Queen of Chotanagpur, famous for sunrise and sunset views",
    attractions: ["Sunrise Point", "Sunset Point", "Netarhat Dam"],
    image: "/assets/Pics-2.jpg"
  },
  {
    id: 3,
    name: "Deoghar",
    description: "Sacred city with ancient temples and spiritual significance",
    attractions: ["Baidyanath Temple", "Nandan Pahar", "Tapovan"],
    image: "/assets/Pics-3.jpg"
  }
];

// Mock API responses
export const getMockPackages = (query = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredPackages = [...mockPackages];
      
      // Parse query parameters
      const searchParams = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
      const type = searchParams.get('type');
      const search = searchParams.get('search');
      const featured = searchParams.get('featured');
      
      if (type) {
        filteredPackages = filteredPackages.filter(pkg => pkg.type === type);
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPackages = filteredPackages.filter(pkg => 
          pkg.title.toLowerCase().includes(searchLower) ||
          pkg.description.toLowerCase().includes(searchLower) ||
          pkg.location.toLowerCase().includes(searchLower)
        );
      }
      
      if (featured === 'true') {
        filteredPackages = filteredPackages.filter(pkg => pkg.featured);
      }
      
      resolve({
        success: true,
        data: filteredPackages,
        count: filteredPackages.length
      });
    }, 100); // Simulate network delay
  });
};

export const getMockFeaturedPackages = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const featuredPackages = mockPackages.filter(pkg => pkg.featured);
      resolve({
        success: true,
        data: featuredPackages,
        count: featuredPackages.length
      });
    }, 100);
  });
};

export const getMockPackage = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const packageId = parseInt(id);
      const foundPackage = mockPackages.find(pkg => pkg.id === packageId);
      
      if (!foundPackage) {
        reject(new Error('Package not found'));
        return;
      }
      
      resolve({
        success: true,
        data: foundPackage
      });
    }, 100);
  });
};

export const getMockDestinations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockDestinations,
        count: mockDestinations.length
      });
    }, 100);
  });
};

export const searchMockTourism = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchLower = query.toLowerCase();
      const matchingPackages = mockPackages.filter(pkg => 
        pkg.title.toLowerCase().includes(searchLower) ||
        pkg.description.toLowerCase().includes(searchLower) ||
        pkg.location.toLowerCase().includes(searchLower)
      );

      let aiResponse = '';
      if (searchLower.includes('weather')) {
        aiResponse = 'Jharkhand has a pleasant climate. Best time to visit is October to March with temperatures between 15-25°C.';
      } else if (searchLower.includes('food') || searchLower.includes('cuisine')) {
        aiResponse = 'Jharkhand cuisine includes traditional dishes like Litti Chokha, Rugra, and various tribal delicacies. Our culinary tours offer authentic experiences.';
      } else if (searchLower.includes('festival') || searchLower.includes('culture')) {
        aiResponse = 'Jharkhand celebrates various tribal festivals like Sarhul, Karma, and Sohrai. Experience rich cultural heritage through our festival tours.';
      } else {
        aiResponse = `Found ${matchingPackages.length} packages related to "${query}". Jharkhand offers diverse tourism experiences from adventure to cultural immersion.`;
      }

      resolve({
        success: true,
        data: {
          query: query,
          response: aiResponse,
          packages: matchingPackages.slice(0, 3),
          destinations: mockDestinations.filter(dest => 
            dest.name.toLowerCase().includes(searchLower) ||
            dest.description.toLowerCase().includes(searchLower)
          )
        }
      });
    }, 200);
  });
};