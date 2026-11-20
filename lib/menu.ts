export type Ingredient = { name: string; icon: string };

export type Dish = {
  id: string;
  name: string;
  category: string;
  mood: string;
  description: string;
  price: number;
  time: string;
  serving: string;
  tags: string[];
  ingredients: Ingredient[];
  /** Unsplash photo id, shot top-down so it crops cleanly to a circle */
  photo: string;
};

export const dishes: Dish[] = [
  {
    id: "ca-hoi-ap-chao",
    name: "Cá hồi áp chảo",
    category: "Món chính",
    mood: "Tinh tế & thanh vị",
    description: "Cá hồi Na Uy áp chảo da giòn, rau củ non và sốt bơ chanh thơm dịu.",
    price: 289000,
    time: "20–25 phút",
    serving: "1 người",
    tags: ["Cá hồi", "Rau củ non", "Bơ chanh"],
    ingredients: [
      { name: "Cá hồi Na Uy", icon: "🐟" },
      { name: "Rau củ non", icon: "🥬" },
      { name: "Sốt bơ chanh", icon: "🍋" },
      { name: "Thì là", icon: "🌿" },
    ],
    photo: "1580959375944-abd7e991f971",
  },
  {
    id: "bo-nuong-tieu-den",
    name: "Bò nướng tiêu đen",
    category: "Món chính",
    mood: "Đậm đà & mạnh mẽ",
    description: "Thăn bò Úc nướng than, sốt tiêu đen cay nồng, ăn kèm khoai nghiền mịn.",
    price: 329000,
    time: "25–30 phút",
    serving: "1 người",
    tags: ["Thăn bò Úc", "Tiêu đen", "Khoai nghiền"],
    ingredients: [
      { name: "Thăn bò Úc", icon: "🥩" },
      { name: "Tiêu đen Phú Quốc", icon: "🌶️" },
      { name: "Khoai nghiền", icon: "🥔" },
      { name: "Bông cải xanh", icon: "🥦" },
    ],
    photo: "1681821674991-03c40fba40e9",
  },
  {
    id: "pho-bo-tai",
    name: "Phở bò tái",
    category: "Vị Việt",
    mood: "Thân quen & tròn vị",
    description: "Nước dùng hầm xương mười hai tiếng, bò tái mềm, hành lá và rau thơm.",
    price: 89000,
    time: "10–15 phút",
    serving: "1 người",
    tags: ["Bò tái", "Bánh phở", "Nước dùng xương"],
    ingredients: [
      { name: "Bò tái", icon: "🥩" },
      { name: "Bánh phở", icon: "🍜" },
      { name: "Hành lá", icon: "🧅" },
      { name: "Rau thơm", icon: "🌿" },
    ],
    photo: "1582878826629-29b7ad1cdc43",
  },
  {
    id: "salad-vuon-xanh",
    name: "Salad vườn xanh",
    category: "Món nhẹ",
    mood: "Tươi mát & thanh nhẹ",
    description: "Rau xanh theo mùa, đậu que, phô mai tươi và dầu ô liu ép lạnh.",
    price: 129000,
    time: "10 phút",
    serving: "1 người",
    tags: ["Rau theo mùa", "Phô mai tươi", "Dầu ô liu"],
    ingredients: [
      { name: "Rau theo mùa", icon: "🥗" },
      { name: "Đậu que", icon: "🫛" },
      { name: "Phô mai tươi", icon: "🧀" },
      { name: "Dầu ô liu", icon: "🫒" },
    ],
    photo: "1595243766733-d2d4c7e3448e",
  },
  {
    id: "ca-hoi-sot-cam",
    name: "Cá hồi sốt cam",
    category: "Món chính",
    mood: "Ngọt dịu & tươi mới",
    description: "Cá hồi nướng phủ sốt cam mật ong, cà rốt baby và bơ nghiền.",
    price: 269000,
    time: "20 phút",
    serving: "1 người",
    tags: ["Cá hồi", "Sốt cam", "Cà rốt baby"],
    ingredients: [
      { name: "Cá hồi", icon: "🐟" },
      { name: "Sốt cam mật ong", icon: "🍊" },
      { name: "Cà rốt baby", icon: "🥕" },
      { name: "Bơ nghiền", icon: "🥑" },
    ],
    photo: "1712334562767-5d366d0c40d9",
  },
  {
    id: "bo-nuong-huong-thao",
    name: "Bò nướng hương thảo",
    category: "Món chính",
    mood: "Mộc mạc & thơm nồng",
    description: "Bò thái lát nướng vừa tới, hương thảo, nấm nâu và sốt vang đỏ.",
    price: 339000,
    time: "25 phút",
    serving: "1 người",
    tags: ["Bò thái lát", "Hương thảo", "Nấm nâu"],
    ingredients: [
      { name: "Bò thái lát", icon: "🥩" },
      { name: "Hương thảo", icon: "🌿" },
      { name: "Nấm nâu", icon: "🍄" },
      { name: "Sốt vang đỏ", icon: "🍷" },
    ],
    photo: "1723200295608-fa8efcee6781",
  },
  {
    id: "mi-nuoc-rau-cu",
    name: "Mì nước rau củ",
    category: "Vị Việt",
    mood: "Nhẹ nhàng & ấm áp",
    description: "Sợi mì trứng trong nước dùng rau củ ngọt thanh, cà chua bi và rau mầm.",
    price: 79000,
    time: "10–15 phút",
    serving: "1 người",
    tags: ["Mì trứng", "Rau củ", "Cà chua bi"],
    ingredients: [
      { name: "Mì trứng", icon: "🍜" },
      { name: "Rau củ", icon: "🥕" },
      { name: "Cà chua bi", icon: "🍅" },
      { name: "Rau mầm", icon: "🌱" },
    ],
    photo: "1631709497146-a239ef373cf1",
  },
  {
    id: "ca-chien-dau-que",
    name: "Cá chiên giòn đậu que",
    category: "Món chính",
    mood: "Giòn rụm & dân dã",
    description: "Phi lê cá chiên xù vàng giòn, đậu que xào tỏi và sốt chanh dây.",
    price: 189000,
    time: "15–20 phút",
    serving: "1 người",
    tags: ["Phi lê cá", "Đậu que", "Chanh dây"],
    ingredients: [
      { name: "Phi lê cá", icon: "🐟" },
      { name: "Đậu que", icon: "🫛" },
      { name: "Tỏi phi", icon: "🧄" },
      { name: "Sốt chanh dây", icon: "🍋" },
    ],
    photo: "1595936126366-6e85b4812ca2",
  },
  {
    id: "bo-tai-chanh",
    name: "Bò tái chanh kiểu Pháp",
    category: "Khai vị",
    mood: "Tươi sống & sắc vị",
    description: "Thăn bò băm tay trộn chanh vàng, hành tím, nụ bạch hoa và dầu ô liu.",
    price: 219000,
    time: "10 phút",
    serving: "1 người",
    tags: ["Thăn bò", "Chanh vàng", "Nụ bạch hoa"],
    ingredients: [
      { name: "Thăn bò", icon: "🥩" },
      { name: "Chanh vàng", icon: "🍋" },
      { name: "Hành tím", icon: "🧅" },
      { name: "Dầu ô liu", icon: "🫒" },
    ],
    photo: "1675670632673-0f3a77314706",
  },
  {
    id: "bo-kho-thao-moc",
    name: "Bò kho thảo mộc",
    category: "Vị Việt",
    mood: "Đậm đà & ấm nồng",
    description: "Bò hầm sả, quế, hồi trong nước dùng sánh, ăn kèm rau thơm.",
    price: 119000,
    time: "15 phút",
    serving: "1 người",
    tags: ["Bò hầm", "Sả", "Quế hồi"],
    ingredients: [
      { name: "Bò hầm", icon: "🥩" },
      { name: "Sả", icon: "🌾" },
      { name: "Quế hồi", icon: "⭐" },
      { name: "Rau thơm", icon: "🌿" },
    ],
    photo: "1636474498689-27e2d3ecf8d7",
  },
  {
    id: "khoai-nuong-pho-mai",
    name: "Khoai nướng phô mai",
    category: "Món nhẹ",
    mood: "Béo ngậy & giòn thơm",
    description: "Khoai tây nướng giòn, phô mai bào, thịt xông khói và kem chua.",
    price: 99000,
    time: "15 phút",
    serving: "1–2 người",
    tags: ["Khoai tây", "Phô mai", "Kem chua"],
    ingredients: [
      { name: "Khoai tây", icon: "🥔" },
      { name: "Phô mai bào", icon: "🧀" },
      { name: "Thịt xông khói", icon: "🥓" },
      { name: "Kem chua", icon: "🥛" },
    ],
    photo: "1777994505589-75c2028c80fa",
  },
  {
    id: "mi-y-rau-cu",
    name: "Mì Ý rau củ ô liu",
    category: "Món chính",
    mood: "Rực rỡ & thanh mát",
    description: "Mì Ý sốt cà chua tươi, ớt chuông nướng, ô liu đen và húng tây.",
    price: 159000,
    time: "15–20 phút",
    serving: "1 người",
    tags: ["Mì Ý", "Ớt chuông", "Ô liu đen"],
    ingredients: [
      { name: "Mì Ý", icon: "🍝" },
      { name: "Ớt chuông", icon: "🫑" },
      { name: "Ô liu đen", icon: "🫒" },
      { name: "Húng tây", icon: "🌿" },
    ],
    photo: "1777994505580-33478f04fa4a",
  },
];

export const photoUrl = (photo: string, size = 900) =>
  `https://images.unsplash.com/photo-${photo}?w=${size}&h=${size}&fit=crop&auto=format&q=80`;

export const formatPrice = (n: number) => `${n.toLocaleString("vi-VN")} đ`;

export const DELIVERY_FEE = 20000;
export const FREE_DELIVERY_FROM = 300000;
