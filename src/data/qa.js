// 問答集資料結構
export const qaData = [
  {
    id: "qa1",
    category: "般若智慧",
    question: "什麼是般若波羅蜜多？",
    answer: "般若波羅蜜多梵文為 Prajñāpāramitā，意思是「智慧到彼岸」。般若是指能夠洞察諸法實相的智慧，特別是空性智慧；波羅蜜多是「到彼岸」的意思，表示透過修習般若智慧，能夠從生死輪迴的此岸，到達涅槃解脫的彼岸。這是大乘佛教最重要的修行法門之一。",
    tags: ["般若", "智慧", "波羅蜜多"]
  },
  {
    id: "qa2",
    category: "修行方法",
    question: "如何理解「照見五蘊皆空」？",
    answer: "五蘊是指色、受、想、行、識，涵蓋了我們身心的全部現象。「照見五蘊皆空」不是說這些現象不存在，而是說它們沒有固定不變的自性。透過般若智慧的觀照，我們能夠看到：色身會變化衰老、感受會生滅無常、想法會此起彼落、行為會因緣而起、意識會剎那變遷。理解這種「空性」能幫助我們放下執著，度脫一切苦厄。",
    tags: ["五蘊", "空性", "觀照", "修行"]
  },
  {
    id: "qa3",
    category: "經典理解",
    question: "為什麼金剛經說「應無所住而生其心」？",
    answer: "「應無所住而生其心」是金剛經的核心教導。「無所住」是指心不要執著於任何現象，不要被外境所束縛；「生其心」是指要發起清淨的菩提心，慈悲利益眾生。這句話教導我們要在不執著的智慧中保持慈悲的行動，既要有出世的智慧（無住），也要有入世的慈悲（生心）。這是大乘菩薩道的精髓：空而不斷，有而不執。",
    tags: ["金剛經", "無所住", "菩提心", "慈悲"]
  },
  {
    id: "qa4",
    category: "日常應用",
    question: "如何在日常生活中修習般若智慧？",
    answer: "在日常生活中修習般若智慧有以下幾個方法：\n1. 觀察無常：注意身邊事物的變化，體會一切都在流轉中\n2. 放下執著：遇到順逆境界時，提醒自己「凡所有相，皆是虛妄」\n3. 慈悲待人：以無分別心對待一切眾生，不因個人好惡而偏私\n4. 正念覺察：時刻保持清醒的覺知，不被情緒和妄念牽引\n5. 學習經典：定期讀誦般若經典，深入理解空性智慧的內涵",
    tags: ["日常修行", "無常", "正念", "慈悲"]
  },
  {
    id: "qa5",
    category: "經典背景",
    question: "為什麼心經只有260個字卻如此重要？",
    answer: "般若波羅蜜多心經雖然只有260個字，但它是整部大般若經（共600卷）的精華濃縮。它完整地涵蓋了般若法門的核心要義：空性智慧、五蘊皆空、無所得、般若波羅蜜多咒等。短短的篇幅中包含了：1) 修行的主體（觀自在菩薩）2) 修行的方法（行深般若波羅蜜多）3) 修行的成果（度一切苦厄）4) 理論的闡述（色即是空，空即是色）5) 實踐的指導（般若波羅蜜多咒）。因此被稱為「經中之王」。",
    tags: ["心經", "般若經", "空性", "修行成果"]
  },
  {
    id: "qa6",
    category: "修行疑問",
    question: "什麼是「三輪體空」？",
    answer: "三輪體空是大乘佛教重要的修行理念，指在行善布施時要做到：\n1. 施者空：不執著於「我在布施」的想法\n2. 受者空：不執著於接受布施的對象\n3. 所施物空：不執著於布施的財物或功德\n當我們能夠不執著這三者時，所作的功德才是真正清淨無漏的。這不是不做善事，而是在做善事時心無罣礙，不求回報，這樣的布施才能真正利益眾生，也能讓自己累積無量功德。",
    tags: ["三輪體空", "布施", "功德", "無執著"]
  }
];

// 取得所有問答類別
export const getQACategories = () => {
  const categories = [...new Set(qaData.map(item => item.category))];
  return categories;
};

// 根據類別篩選問答
export const getQAByCategory = (category) => {
  if (!category) return qaData;
  return qaData.filter(item => item.category === category);
};

// 搜尋問答內容
export const searchQA = (keyword) => {
  if (!keyword) return qaData;
  const lowerKeyword = keyword.toLowerCase();
  return qaData.filter(item => 
    item.question.toLowerCase().includes(lowerKeyword) ||
    item.answer.toLowerCase().includes(lowerKeyword) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
}; 