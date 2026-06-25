export function resolveImage(imageUrl?: string, localImage?: string) {
  const target = localImage || imageUrl;

  if (target) {
    if (target.includes('OIP.jpg')) {
      return require('../assets/photos/OIP.jpg');
    }
    if (target.includes('01_6_396d') || target.includes('01_6_396d76c1-6654-44b3-b739-e67c316202e1.webp')) {
      return require('../assets/photos/01_6_396d76c1-6654-44b3-b739-e67c316202e1.webp');
    }
    if (target.includes('187Q0MR') || target.includes('187Q0MR-lT1ZE8TIQUTM69vAuXDPxma3c_w1000_a5713258-5bf0-479f-91d1-a3d5b43cfebf.webp')) {
      return require('../assets/photos/187Q0MR-lT1ZE8TIQUTM69vAuXDPxma3c_w1000_a5713258-5bf0-479f-91d1-a3d5b43cfebf.webp');
    }
    if (target.includes('41Fr0h') || target.includes('41Fr0hXWn6L.jpg')) {
      return require('../assets/photos/41Fr0hXWn6L.jpg');
    }
    if (target.includes('51RBBJY0ZFL') || target.includes('51RBBJY0ZFL._SL1080_b0d5a0a8-377f-498d-aac4-0189af15865e.webp')) {
      return require('../assets/photos/51RBBJY0ZFL._SL1080_b0d5a0a8-377f-498d-aac4-0189af15865e.webp');
    }
    if (target.includes('61nd7NqagVL') || target.includes('61nd7NqagVL._SX466.webp')) {
      return require('../assets/photos/61nd7NqagVL._SX466.webp');
    }
    if (target.includes('71Fb39HZ') || target.includes('71Fb39HZ5XL._SL1500.webp')) {
      return require('../assets/photos/71Fb39HZ5XL._SL1500.webp');
    }
    if (target.includes('App_designs_500_x_600_mm_1_cd17998f-1e9b-4120-af77-eb2bd1a59b8a (1).webp')) {
      return require('../assets/photos/App_designs_500_x_600_mm_1_cd17998f-1e9b-4120-af77-eb2bd1a59b8a (1).webp');
    }
    if (target.includes('App_designs_500_x_600_mm_1_cd17998f-1e9b-4120-af77-eb2bd1a59b8a.webp')) {
      return require('../assets/photos/App_designs_500_x_600_mm_1_cd17998f-1e9b-4120-af77-eb2bd1a59b8a.webp');
    }
    if (target.includes('Baby_Gear_Main_Banner') || target.includes('Baby_Gear_Main_Banner.webp')) {
      return require('../assets/photos/Baby_Gear_Main_Banner.webp');
    }
    if (target.includes('Black_1_10c0') || target.includes('Black_1_10c0835a-b8c7-4431-b4e0-89272d392737.webp')) {
      return require('../assets/photos/Black_1_10c0835a-b8c7-4431-b4e0-89272d392737.webp');
    }
    if (target.includes('Blog_Illustration_17') || target.includes('Blog_Illustration_17.webp')) {
      return require('../assets/photos/Blog_Illustration_17.webp');
    }
    if (target.includes('Books_Main_Banner') || target.includes('Books_Main_Banner.webp')) {
      return require('../assets/photos/Books_Main_Banner.webp');
    }
    if (target.includes('Boys_Main_Banner') || target.includes('Boys_Main_Banner.webp')) {
      return require('../assets/photos/Boys_Main_Banner.webp');
    }
    if (target.includes('Final_Homepage_GIF') || target.includes('Final_Homepage_GIF_27_April_2026.webp')) {
      return require('../assets/photos/Final_Homepage_GIF_27_April_2026.webp');
    }
    if (target.includes('Front_00f9f081') || target.includes('Front_00f9f081-a3b8-43b7-b833-9abe9c95f814.webp')) {
      return require('../assets/photos/Front_00f9f081-a3b8-43b7-b833-9abe9c95f814.webp');
    }
    if (target.includes('Girl_Main_Banner') || target.includes('Girl_Main_Banner.webp')) {
      return require('../assets/photos/Girl_Main_Banner.webp');
    }
    if (target.includes('New_Moms_Page_Banner') || target.includes('New_Moms_Page_Banner.webp')) {
      return require('../assets/photos/New_Moms_Page_Banner.webp');
    }
    if (target.includes('Screenshot_2026') || target.includes('Screenshot_2026-04-10_124132_lyoa5u.webp')) {
      return require('../assets/photos/Screenshot_2026-04-10_124132_lyoa5u.webp');
    }
    if (target.includes('Toys_Main_Banner') || target.includes('Toys_Main_Banner.webp')) {
      return require('../assets/photos/Toys_Main_Banner.webp');
    }
    if (target.includes('WhatsApp_Image') || target.includes('WhatsApp_Image_2026-03-08_at_11.26.09_PM_0f0e04e9-d51f-4dd3-a7f5-5afa74d96096.webp')) {
      return require('../assets/photos/WhatsApp_Image_2026-03-08_at_11.26.09_PM_0f0e04e9-d51f-4dd3-a7f5-5afa74d96096.webp');
    }
    if (target.includes('ad46eff2') || target.includes('ad46eff2-cfe7-4cf6-923a-411f3a8a4ff9_full.webp')) {
      return require('../assets/photos/ad46eff2-cfe7-4cf6-923a-411f3a8a4ff9_full.webp');
    }
    if (target.includes('baby-winter-wonderland') || target.includes('baby-winter-wonderland-sleepsuit-onesie_2_aa0gaa.webp')) {
      return require('../assets/photos/baby-winter-wonderland-sleepsuit-onesie_2_aa0gaa.webp');
    }
  }

  // Fallback placeholder
  return require('../assets/photos/OIP.jpg');
}
