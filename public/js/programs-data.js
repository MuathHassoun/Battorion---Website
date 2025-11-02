const programs = [
  {
    name: "PC Manager",
    company: "Microsoft",
    description: "An integrated Windows utility for optimizing PC performance, managing battery health, driver updates, and system cleanup.",
    os: "Windows 10 and later (64-bit only)",
    license: "Free",
    image: "../img/recommendations/pcmanager.jpg",
    core: "Dual-core, 64-bit only",
    size: "≈10 MB",
    links: [
      { label: "Download PC Manager", url: "https://pcmanager.microsoft.com/en-us" },
      { label: "Microsoft Store Link", url: "https://apps.microsoft.com/detail/xbox/9PM860492SZD" }
    ]
  },
  {
    name: "BatteryCare",
    company: "BatteryCare Team",
    description: "A lightweight app focused on monitoring battery cycles, optimizing charging, and prolonging laptop battery life.",
    os: "Windows XP to Windows 10 (32/64-bit)",
    license: "Free",
    image: "../img/recommendations/batterycare.jpg",
    core: "Single-core, 32/64-bit",
    size: "≈2 MB",
    links: [
      { label: "Download BatteryCare", url: "https://batterycare.net/en/download.html" },
      { label: "Official Website", url: "https://batterycare.net" }
    ]
  },
  {
    name: "IObit Advanced SystemCare",
    company: "IObit",
    description: "A powerful PC optimization suite that cleans junk files, manages startup items, and improves system stability and performance.",
    os: "Windows 7 and later (32/64-bit)",
    license: "Free & Paid Versions",
    image: "../img/recommendations/iobit.png",
    core: "Dual-core, 32/64-bit",
    size: "≈50 MB",
    links: [
      { label: "Download Advanced SystemCare - Free", url: "https://www.iobit.com/en/advancedsystemcarefree.php" },
      { label: "Download Advanced SystemCare - Ultimate", url: "https://apps.microsoft.com/detail/xp99k5dndx79rt?hl=en-US&gl=US" }
    ]
  },
  {
    name: "coconutBattery",
    company: "coconut-flavour",
    description: "A popular macOS app to monitor battery health, charge cycles, temperature, and capacity of Mac laptops and iOS devices.",
    os: "macOS (Intel and Apple Silicon)",
    license: "Free & Paid Version (Plus)",
    image: "../img/recommendations/coconutBattery.jpg",
    core: "Intel/Apple Silicon, 64-bit",
    size: "≈10 MB",
    links: [
      { label: "Download coconutBattery", url: "https://www.coconut-flavour.com/coconutbattery/" }
    ]
  },
  {
    name: "CleanMyMac X",
    company: "MacPaw",
    description: "A comprehensive Mac optimization tool that cleans junk files, monitors battery health, and improves system performance.",
    os: "macOS (64-bit only)",
    license: "Paid (Free trial available)",
    image: "../img/recommendations/cleanMyMac.jpg",
    core: "Dual-core, 64-bit only",
    size: "≈150 MB",
    links: [
      { label: "Smart cleaner and optimizer for macOS", url: "https://macpaw.com/cleanmymac" }
    ]
  },
  {
    name: "TLP",
    company: "Open-source community",
    description: "A command-line Linux tool to optimize battery life through advanced power management settings.",
    os: "Linux (32/64-bit)",
    license: "Free (Open Source)",
    image: "../img/recommendations/tlp.png",
    core: "Any modern CPU, 32/64-bit",
    size: "≈1 MB",
    links: [
      { label: "Learn More & Install TLP", url: "https://linrunner.de/tlp/installation/index.html" },
      { label: "Official Website", url: "https://linrunner.de/tlp/" }
    ]
  },
  {
    name: "GNOME Power Manager",
    company: "GNOME Project",
    description: "Integrated power management tool for Linux desktops using GNOME, offering battery monitoring and energy-saving features.",
    os: "Linux (GNOME Desktop, 32/64-bit)",
    license: "Free (Open Source)",
    image: "../img/recommendations/gnome.jpg",
    core: "Any modern CPU, 32/64-bit",
    size: "≈2 MB",
    links: [
      { label: "Learn More & Install GNOME Power Manager", url: "https://pkgs.org/download/gnome-power-manager" }
    ]
  },
  {
    name: "MacClean",
    company: "iMobie",
    description: "Cleaner and performance booster for macOS, focusing on junk removal and system optimization.",
    os: "macOS (64-bit only)",
    license: "Free",
    image: "../img/recommendations/macClean.png",
    core: "Dual-core, 64-bit only",
    size: "≈25 MB",
    links: [
      { label: "Official Website", url: "https://www.imobie.com/macclean/" }
    ]
  },
  {
    name: "Stacer",
    company: "Oguzhan Inan",
    description: "Linux system optimizer and monitor with a beautiful GUI and advanced management tools.",
    os: "Linux (64-bit only)",
    license: "Free (Open Source)",
    image: "../img/recommendations/stacer.jpg",
    core: "Dual-core, 64-bit (unofficial 32-bit builds may exist)",
    size: "≈50 MB",
    links: [
      { label: "GitHub", url: "https://github.com/oguzhaninan/Stacer" }
    ]
  },
  {
    name: "Topgrade",
    company: "Topgrade-rs Team",
    description: "Command-line tool that upgrades all major tools and software on your system in one go.",
    os: "Linux, Windows, macOS (32/64-bit)",
    license: "Free (Open Source)",
    image: "../img/recommendations/topgrade.png",
    core: "Any modern CPU, 32/64-bit",
    size: "≈4 MB",
    links: [
      { label: "GitHub", url: "https://github.com/topgrade-rs/topgrade" }
    ]
  },
  {
    name: "Battery Limiter",
    company: "robotonfire",
    description: "Warns when battery charge reaches a set maximum limit to prevent overcharging.",
    os: "Windows (32-bit only, works on 64-bit too)",
    license: "Free",
    image: "../img/recommendations/batteryLimiter.png",
    core: "Single-core, 32-bit (compatible with 64-bit)",
    size: "≈2 MB",
    links: [
      { label: "Official Website", url: "https://www.robotonfire.com/bl/" }
    ]
  },
  {
    name: "SlimCleaner Free",
    company: "SlimWare Utilities",
    description: "Cloud-based system optimizer and cleaner for Windows PCs.",
    os: "Windows (32/64-bit)",
    license: "Free",
    image: "../img/recommendations/slimCleaner.jpg",
    core: "Dual-core, 32/64-bit",
    size: "≈20 MB",
    links: [
      { label: "Official Website", url: "https://slimcleaner.en.softonic.com/" }
    ]
  },
  {
    name: "BleachBit",
    company: "BleachBit Team",
    description: "Open-source disk space cleaner and privacy manager for Linux and Windows.",
    os: "Linux, Windows (32/64-bit)",
    license: "Free",
    image: "../img/recommendations/bleachBit.jpg",
    core: "Single-core, 32/64-bit",
    size: "≈10 MB",
    links: [
      { label: "Official Website", url: "https://www.bleachbit.org/" }
    ]
  },
  {
    name: "Avira System Speedup",
    company: "Avira",
    description: "Startup optimizer, junk file cleaner, and overall performance booster for Windows.",
    os: "Windows (32/64-bit)",
    license: "Free / Paid",
    image: "../img/recommendations/avira.jpg",
    core: "Dual-core, 32/64-bit",
    size: "≈100 MB",
    links: [
      { label: "Official Website", url: "https://www.avira.com/" }
    ]
  },
  {
    name: "RAMMap",
    company: "Microsoft Sysinternals",
    description: "Advanced memory usage analysis tool for Windows that shows detailed breakdowns of RAM allocation, standby lists, and file cache. Useful for troubleshooting performance and memory leaks.",
    os: "Windows (32/64-bit)",
    license: "Free",
    image: "../img/recommendations/rammap.png",
    core: "Dual-core, 32/64-bit",
    size: "≈2 MB",
    links: [
      { label: "Official Website", url: "https://learn.microsoft.com/en-us/sysinternals/downloads/rammap" }
    ]
  }
];
