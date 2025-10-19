const products = [
  {
    id: "RET-10",
    name: "Retatrutide 10mg",
    dosage: "10 mg",
    volume: "3 mL",
    category: "GLP",
    price: 45,
    image: "products/reta10mg.webp",
    images: ["products/reta10mg.webp", "coas/reta10.png"],
    tags: ["popular"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    // "options": [
    //   {
    //     "id": "o1",
    //     "label": "3 Pack",
    //     "price": 95.97,
    //     "compareAt": 75.0,
    //     "badge": "BEST VALUE"
    //   },
    //   {
    //     "id": "o2",
    //     "label": "2 Pack",
    //     "price": 27.18,
    //     "compareAt": 50.0,
    //     "badge": "MOST POPULAR"
    //   },
    //   { "id": "o3", "label": "1 Pack", "price": 15.99 }
    // ],

    purchase: {
      headline: "How to Purchase",
      facebook:
        "https://www.facebook.com/people/Gurnee-Peptides/61580797282365/#",
      email: "gurneepeptides@gmail.com",
      note: "Message us on Facebook to purchase. If unavailable, email us directly.",
    },

    faq: [
      {
        q: "Is this product ready to ship?",
        a: "Most items are in stock; message us to secure yours.",
      },
      {
        q: "Do you offer bulk pricing?",
        a: "Yes—include expected quantities in your message/email for a quote.",
      },
      {
        q: "How does the purchase process work?",
        a: "Customers can message us on Facebook (preferred) or email us with the items they’d like to purchase. We will then send an invoice by email, and payment can be made securely using their preferred method. Orders placed before 3 PM ship the same day, with exceptions on weekends.",
      },
    ],
    description:
      "Retatrutide is a multi-receptor GLP research compound studied for its potential in supporting weight management, metabolic balance, and blood sugar control. Early research has shown promising effects on reducing appetite, improving insulin sensitivity, and promoting overall metabolic health. Each vial is lab-tested for purity, providing researchers with a consistent foundation for advanced metabolic studies.",
  },
  {
    id: "RET-15",
    name: "Retatrutide 15mg",
    dosage: "15 mg",
    volume: "3 mL",
    category: "GLP",
    price: 55,
    image: "products/reta15mg.webp",
    images: ["products/reta15mg.webp", "coas/reta10.png"],

    tags: ["popular"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Retatrutide is a multi-receptor GLP research compound studied for its potential in supporting weight management, metabolic balance, and blood sugar control. Early research has shown promising effects on reducing appetite, improving insulin sensitivity, and promoting overall metabolic health. Each vial is lab-tested for purity, providing researchers with a consistent foundation for advanced metabolic studies.",
  },
  {
    id: "RET-20",
    name: "Retatrutide 20mg",
    dosage: "20 mg",
    volume: "3 mL",
    category: "GLP",
    price: 70,
    image: "products/reta20mg.webp",
    images: ["products/reta20mg.webp", "coas/reta10.png"],

    tags: ["Out of Stock"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Retatrutide is a multi-receptor GLP research compound studied for its potential in supporting weight management, metabolic balance, and blood sugar control. Early research has shown promising effects on reducing appetite, improving insulin sensitivity, and promoting overall metabolic health. Each vial is lab-tested for purity, providing researchers with a consistent foundation for advanced metabolic studies.",
  },
  {
    id: "TIRZ-10",
    name: "Tirzepatide 10mg",
    dosage: "10 mg",
    volume: "3 mL",
    category: "GLP",
    price: 40,
    image: "products/tirz10mg.webp",
    images: ["products/tirz10mg.webp", "coas/tirz10coa.png"],

    tags: ["new"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist widely studied for its role in weight reduction and glucose regulation. Research has shown significant improvements in appetite control, insulin sensitivity, and metabolic function, making it one of the most promising compounds in modern metabolic research. Each vial is lab-tested for purity and consistency, giving researchers a reliable tool for advancing studies in metabolic health.",
  },
  {
    id: "TIRZ-15",
    name: "Tirzepatide 15mg",
    dosage: "15 mg",
    volume: "3 mL",
    category: "GLP",
    price: 55,
    image: "products/tirz15mg.webp",
    images: ["products/tirz15mg.webp", "coas/tirz10coa.png"],

    tags: ["new"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist widely studied for its role in weight reduction and glucose regulation. Research has shown significant improvements in appetite control, insulin sensitivity, and metabolic function, making it one of the most promising compounds in modern metabolic research. Each vial is lab-tested for purity and consistency, giving researchers a reliable tool for advancing studies in metabolic health.",
  },
  {
    id: "TIRZ-20",
    name: "Tirzepatide 20mg",
    dosage: "20 mg",
    volume: "3 mL",
    category: "GLP",
    price: 70,
    image: "products/tirz20.webp",
    images: ["products/tirz20mg.webp", "coas/tirz10coa.png"],

    tags: ["new"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist widely studied for its role in weight reduction and glucose regulation. Research has shown significant improvements in appetite control, insulin sensitivity, and metabolic function, making it one of the most promising compounds in modern metabolic research. Each vial is lab-tested for purity and consistency, giving researchers a reliable tool for advancing studies in metabolic health.",
  },
  {
    id: "TIRZ-30",
    name: "Tirzepatide 30mg",
    dosage: "30 mg",
    volume: "3 mL",
    category: "GLP",
    price: 80,
    image: "products/tirz30mg.webp",
    images: ["products/tirz30mg.webp", "coas/tirz10coa.png"],

    tags: ["new"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist widely studied for its role in weight reduction and glucose regulation. Research has shown significant improvements in appetite control, insulin sensitivity, and metabolic function, making it one of the most promising compounds in modern metabolic research. Each vial is lab-tested for purity and consistency, giving researchers a reliable tool for advancing studies in metabolic health.",
  },
  {
    id: "TIRZ-50",
    name: "Tirzepatide 50mg",
    dosage: "50 mg",
    volume: "3 mL",
    category: "GLP",
    price: 95,
    image: "products/tirz50.webp",
    images: ["products/tirz50.webp", "coas/tirz10coa.png"],

    tags: ["new"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist widely studied for its role in weight reduction and glucose regulation. Research has shown significant improvements in appetite control, insulin sensitivity, and metabolic function, making it one of the most promising compounds in modern metabolic research. Each vial is lab-tested for purity and consistency, giving researchers a reliable tool for advancing studies in metabolic health.",
  },
  {
    id: "TIRZ-60",
    name: "Tirzepatide 60mg",
    dosage: "60 mg",
    volume: "3 mL",
    category: "GLP",
    price: 110,
    image: "products/tirz60.webp",
    images: ["products/tirz60.webp", "coas/tirz10coa.png"],

    tags: ["new"],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist widely studied for its role in weight reduction and glucose regulation. Research has shown significant improvements in appetite control, insulin sensitivity, and metabolic function, making it one of the most promising compounds in modern metabolic research. Each vial is lab-tested for purity and consistency, giving researchers a reliable tool for advancing studies in metabolic health.",
  },
  {
    id: "BAC-10ML",
    name: "BAC Water 10ml",
    volume: "10 mL",
    category: "Research Supplies",
    price: 12,
    image: "products/bac10.webp",
    tags: [],
    researchGoals: [],
    description:
      "Bacteriostatic Water (BAC Water) is sterile, non-pyrogenic water containing 0.9% benzyl alcohol. It is commonly used in research for reconstituting lyophilized compounds, allowing for accurate preparation and storage of test materials. Its bacteriostatic properties help inhibit bacterial growth, making it suitable for repeated withdrawals under controlled research conditions.",
  },

  {
    id: "HOSPIRA-30ML",
    name: "Hospira 30ml",
    volume: "30 mL",
    category: "Research Supplies",
    price: 30,
    image: "products/hospira.webp",
    tags: [],
    researchGoals: [],
    description:
      "Hospira Water (BAC Water) is sterile, non-pyrogenic water containing 0.9% benzyl alcohol. It is commonly used in research for reconstituting lyophilized compounds, allowing for accurate preparation and storage of test materials. Its bacteriostatic properties help inhibit bacterial growth, making it suitable for repeated withdrawals under controlled research conditions.",
  },
  {
    id: "BPC-5",
    name: "BPC-157 5mg",
    dosage: "5 mg",
    volume: "3 mL",
    category: "Recovery",
    price: 30,
    image: "products/bpc5mg.webp",
    tags: [],
    images: ["products/bpc5mg.webp", "coas/bpc5mg.png"],
    researchGoals: ["recovery", "gut-health", "tissue-repair"],
    description:
      "BPC-157 is a synthetic peptide derived from a protective protein found in gastric juice. Research has shown its potential to support tissue repair, muscle and tendon recovery, and gut health. Studies suggest BPC-157 may promote angiogenesis (new blood vessel growth), accelerate wound healing, and reduce inflammation, making it a widely studied compound in regenerative and recovery-focused research. Each vial is lab-tested for purity to ensure consistent results in experimental settings.",
  },
  {
    id: "WOLV-5-5",
    name: "Wolverine 5mg:5mg",
    dosage: "5 mg + 5 mg",
    volume: "3 mL",
    category: "Recovery",
    price: 45,
    image: "products/bpc_tb5mg.webp",
    images: ["products/bpc_tb5mg.webp", "coas/bpc_tb.png"],

    tags: ["combo"],
    researchGoals: ["recovery", "performance", "tissue-repair"],
    description:
      "The Wolverine Stack combines two of the most studied recovery peptides — BPC-157 and TB-500 — for enhanced research into healing, regeneration, and performance recovery. Studies suggest BPC-157 supports tissue repair, gut protection, and reduced inflammation, while TB-500 has been researched for promoting cell migration, new blood vessel growth, and accelerated recovery from injury. Together, they form a powerful model for exploring synergistic effects in regenerative and performance-based research.",
  },
  {
    id: "GHK-50",
    name: "GHK-Cu 50mg",
    dosage: "50 mg",
    volume: "3 mL",
    category: "Longevity",
    price: 30,
    image: "products/ghk50.webp",
    images: ["products/ghk50.webp", "coas/ghkcu50.png"],

    tags: [],
    researchGoals: ["anti-aging", "longevity", "tissue-repair"],
    description:
      "GHK-Cu is a naturally occurring copper peptide that has been widely studied for its role in skin regeneration, hair growth, and wound healing. Research shows it may stimulate collagen and elastin production, promote angiogenesis (new blood vessel growth), and support anti-inflammatory and antioxidant activity. Because of these properties, GHK-Cu has become a key compound in studies on anti-aging, tissue repair, and cosmetic science. Each vial is lab-tested to ensure purity and reliability in research applications.",
  },
  {
    id: "Tesa-10",
    name: "Tesamorelin 10mg",
    dosage: "10 mg",
    volume: "3 mL",
    category: "GHS",
    price: 45,
    image: "products/tesamorelin10.webp",
    images: ["products/tesamorelin10.webp", "coas/tesa.png"],

    tags: [],
    researchGoals: ["metabolism", "performance", "anti-aging"],
    description:
      "Tesamorelin is a synthetic peptide and growth hormone–releasing hormone (GHRH) analogue studied for its ability to stimulate the natural release of growth hormone. Research has shown it may support fat metabolism, muscle development, and improved body composition, making it a valuable compound in studies of metabolic health and age-related decline. It has also been investigated for its role in lipid regulation and cognitive function. Each vial is lab-tested for purity, providing researchers with a consistent foundation for advanced studies.",
  },
  {
    id: "Ipamorelin-5",
    name: "Ipamorelin 5mg",
    dosage: "5 mg",
    volume: "3 mL",
    category: "GHS",
    price: 35,
    image: "products/ipa5mg.webp",
    images: ["products/ipa5mg.webp", "coas/ipa5.png"],

    tags: [],
    researchGoals: ["recovery", "performance", "anti-aging"],
    description:
      "Ipamorelin is a selective growth hormone secretagogue (GHS) studied for its ability to trigger natural growth hormone release without significantly affecting cortisol or prolactin levels. Research highlights its potential in muscle growth, recovery, bone strength, and fat metabolism, making it a widely studied compound in performance and anti-aging research. Its targeted action and mild profile have made Ipamorelin one of the most explored peptides for safe, controlled growth hormone studies.",
  },
  {
    id: "HCG-5000",
    name: "HCG 5000iu",
    dosage: "5000 iu",
    volume: "3 mL",
    category: "Longevity",
    price: 35,
    image: "products/hcg5000.webp",
    tags: [],
    researchGoals: ["longevity", "performance"],
    description:
      "Human Chorionic Gonadotropin (HCG) is a naturally occurring hormone widely studied for its role in reproductive health and hormone regulation. Research has shown it may stimulate the production of testosterone and support fertility, while also being investigated in studies related to weight management and endocrine system function. Each vial is lab-tested for purity, providing researchers with a reliable compound for exploring hormone-related pathways.",
  },
  {
    id: "NAD-500mg",
    name: "NAD+ 500mg",
    dosage: "500 mg",
    volume: "10 mL",
    category: "Longevity",
    price: 45,
    image: "products/nad500.webp",
    images: ["products/nad500.webp", "coas/nad.png"],

    tags: [],
    researchGoals: ["longevity", "energy", "anti-aging"],
    description:
      "Nicotinamide Adenine Dinucleotide (NAD+) is a vital coenzyme found in every cell, essential for energy production and cellular repair. Research has shown NAD+ plays a central role in metabolism, mitochondrial function, and DNA repair, while also being studied for its potential in anti-aging, neuroprotection, and overall cellular health. Each vial is lab-tested to ensure purity and consistency, giving researchers a dependable compound for advanced studies in longevity and energy metabolism.",
  },
  {
    id: "Cagri-5g",
    name: "Cargrilintide 5mg",
    dosage: "5 mg",
    volume: "3 mL",
    category: "GLPs",
    price: 30,
    image: "products/cagri5.webp",
    images: ["products/cagri5.webp", "coas/cagri.png"],

    tags: [],
    researchGoals: ["weight-management", "metabolism", "appetite-control"],
    description:
      "Cagrilintide is a long-acting analogue of the hormone amylin, studied for its potential in weight management and metabolic control. In clinical trials, once-weekly cagrilintide produced significant bodyweight reductions in people with obesity or overweight.",
  },
  {
    id: "Semax-10mg",
    name: "Semax 10mg",
    dosage: "10 mg",
    volume: "3 mL",
    category: "Nootropics",
    price: 45,
    image: "products/semax10.webp",
    images: ["products/semax10.webp", "coas/semax.png"],

    tags: [],
    researchGoals: ["cognitive", "focus"],
    description:
      "Semax is a synthetic peptide originally developed in Russia, widely studied for its neuroprotective and cognitive-enhancing properties. Research has shown it may support memory, focus, learning, and stress resilience by modulating the brain’s dopaminergic and serotonergic systems. Studies also suggest potential benefits in neuroprotection, stroke recovery, and mood regulation, making Semax a valuable compound in neuroscience and cognitive research. Each vial is lab-tested for purity and reliability to ensure consistent results in experimental settings.",
  },
  {
    id: "Selank-10mg",
    name: "Selank 10mg",
    dosage: "10 mg",
    volume: "3 mL",
    category: "Nootropics",
    price: 40,
    image: "products/selank10.webp",
    images: ["products/selank10.webp", "coas/selank.png"],

    tags: [],
    researchGoals: ["cognitive", "focus"],
    description:
      "Selank is a synthetic peptide derived from the naturally occurring immunomodulatory peptide tuftsin. It has been studied for its potential to support anxiety reduction, mood stabilization, and cognitive function. Research suggests Selank may influence the GABAergic system, helping promote calmness without sedation, while also enhancing memory, focus, and stress resilience. Its dual action in both neurological and immune pathways makes it a widely explored compound in cognitive and mood research. Each vial is lab-tested for purity and consistency to ensure reliable results in experimental settings.",
  },
  {
    id: "MOTSC-10mg",
    name: "Mots-C 10mg",
    dosage: "10 mg",
    volume: "3 mL",
    category: "Energy",
    price: 30,
    image: "products/motsc10.webp",
    images: ["products/motsc10.webp", "coas/motsc.png"],

    tags: [],
    researchGoals: ["energy", "metabolism", "performance"],
    description:
      "MOTS-c is a mitochondrial-derived peptide that has been studied for its role in energy regulation, metabolism, and cellular stress response. Research suggests MOTS-c may help improve insulin sensitivity, exercise endurance, and fat metabolism, while also protecting cells under metabolic or oxidative stress. Because of these effects, it has become a promising compound in studies of longevity, metabolic health, and athletic performance. Each vial is lab-tested for purity and consistency, providing researchers with a reliable foundation for advanced metabolic studies.",
  },
  {
    id: "PT141-10mg",
    name: "PT-141 10mg",
    dosage: "10 mg",
    volume: "3 mL",
    category: "Energy",
    price: 40,
    image: "products/pt141_10.webp",
    images: ["products/pt141_10.webp", "coas/pt141.png"],
    tags: [],
    researchGoals: ["performance"],
    description:
      "PT-141, also known as Bremelanotide, is a peptide studied for its effects on sexual function and arousal pathways. Unlike compounds that act on the vascular system, PT-141 works through the central nervous system, where research has shown it can activate melanocortin receptors involved in sexual desire and performance. Studies suggest potential benefits in both men and women, making PT-141 a key compound in research on libido, arousal, and neurological control of sexual function. Each vial is lab-tested for purity and consistency to ensure reliable results in controlled research settings.",
  },
];

export default products;
