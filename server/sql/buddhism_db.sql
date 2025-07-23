-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-07-23 15:15:51
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `buddhism_db`
--

-- --------------------------------------------------------

--
-- 資料表結構 `chapters`
--

CREATE TABLE `chapters` (
  `id` varchar(255) NOT NULL,
  `scripture_id` varchar(255) NOT NULL COMMENT '所屬典籍ID',
  `name` varchar(500) NOT NULL COMMENT '章節名稱',
  `description` text DEFAULT NULL COMMENT '章節描述',
  `order_index` int(11) DEFAULT 0 COMMENT '排序索引',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='章節表';

--
-- 傾印資料表的資料 `chapters`
--

INSERT INTO `chapters` (`id`, `scripture_id`, `name`, `description`, `order_index`, `created_at`, `updated_at`) VALUES
('chapter1', 'mahaPrajnaparamita', '第一章', '經文開始，敘述說法因緣', 1, '2025-07-23 10:42:55', '2025-07-23 10:42:55'),
('chapter1_diamond', 'diamondSutra', '法會因由分第一', '敘述法會的因緣', 1, '2025-07-23 10:42:55', '2025-07-23 10:42:55'),
('chapter1_heart', 'heartSutra', '觀自在菩薩', '心經全文', 1, '2025-07-23 10:42:55', '2025-07-23 10:42:55'),
('chapter2_diamond', 'diamondSutra', '善現啟請分第二', '須菩提向佛請法', 2, '2025-07-23 10:42:55', '2025-07-23 10:42:55');

-- --------------------------------------------------------

--
-- 資料表結構 `qa`
--

CREATE TABLE `qa` (
  `id` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL COMMENT '問答分類',
  `question` text NOT NULL COMMENT '問題',
  `answer` longtext NOT NULL COMMENT '答案',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '標籤數組' CHECK (json_valid(`tags`)),
  `order_index` int(11) DEFAULT 0 COMMENT '排序索引',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='問答表';

--
-- 傾印資料表的資料 `qa`
--

INSERT INTO `qa` (`id`, `category`, `question`, `answer`, `tags`, `order_index`, `created_at`, `updated_at`) VALUES
('qa1', '般若智慧', '什麼是般若波羅蜜多？', '般若波羅蜜多梵文為 Prajñāpāramitā，意思是「智慧到彼岸」。般若是指能夠洞察諸法實相的智慧，特別是空性智慧；波羅蜜多是「到彼岸」的意思，表示透過修習般若智慧，能夠從生死輪迴的此岸，到達涅槃解脫的彼岸。這是大乘佛教最重要的修行法門之一。', '[\"般若\", \"智慧\", \"波羅蜜多\"]', 1, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('qa2', '修行方法', '如何理解「照見五蘊皆空」？', '五蘊是指色、受、想、行、識，涵蓋了我們身心的全部現象。「照見五蘊皆空」不是說這些現象不存在，而是說它們沒有固定不變的自性。透過般若智慧的觀照，我們能夠看到：色身會變化衰老、感受會生滅無常、想法會此起彼落、行為會因緣而起、意識會剎那變遷。理解這種「空性」能幫助我們放下執著，度脫一切苦厄。', '[\"五蘊\", \"空性\", \"觀照\", \"修行\"]', 2, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('qa3', '經典理解', '為什麼金剛經說「應無所住而生其心」？', '「應無所住而生其心」是金剛經的核心教導。「無所住」是指心不要執著於任何現象，不要被外境所束縛；「生其心」是指要發起清淨的菩提心，慈悲利益眾生。這句話教導我們要在不執著的智慧中保持慈悲的行動，既要有出世的智慧（無住），也要有入世的慈悲（生心）。這是大乘菩薩道的精髓：空而不斷，有而不執。', '[\"金剛經\", \"無所住\", \"菩提心\", \"慈悲\"]', 3, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('qa4', '日常應用', '如何在日常生活中修習般若智慧？', '在日常生活中修習般若智慧有以下幾個方法：\n1. 觀察無常：注意身邊事物的變化，體會一切都在流轉中\n2. 放下執著：遇到順逆境界時，提醒自己「凡所有相，皆是虛妄」\n3. 慈悲待人：以無分別心對待一切眾生，不因個人好惡而偏私\n4. 正念覺察：時刻保持清醒的覺知，不被情緒和妄念牽引\n5. 學習經典：定期讀誦般若經典，深入理解空性智慧的內涵', '[\"日常修行\", \"無常\", \"正念\", \"慈悲\"]', 4, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('qa5', '經典背景', '為什麼心經只有260個字卻如此重要？', '般若波羅蜜多心經雖然只有260個字，但它是整部大般若經（共600卷）的精華濃縮。它完整地涵蓋了般若法門的核心要義：空性智慧、五蘊皆空、無所得、般若波羅蜜多咒等。短短的篇幅中包含了：1) 修行的主體（觀自在菩薩）2) 修行的方法（行深般若波羅蜜多）3) 修行的成果（度一切苦厄）4) 理論的闡述（色即是空，空即是色）5) 實踐的指導（般若波羅蜜多咒）。因此被稱為「經中之王」。', '[\"心經\", \"般若經\", \"空性\", \"修行成果\"]', 5, '2025-07-23 10:42:56', '2025-07-23 10:42:56');

-- --------------------------------------------------------

--
-- 資料表結構 `scriptures`
--

CREATE TABLE `scriptures` (
  `id` varchar(255) NOT NULL,
  `name` varchar(500) NOT NULL COMMENT '典籍名稱',
  `description` text DEFAULT NULL COMMENT '典籍描述',
  `order_index` int(11) DEFAULT 0 COMMENT '排序索引',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='典籍表';

--
-- 傾印資料表的資料 `scriptures`
--

INSERT INTO `scriptures` (`id`, `name`, `description`, `order_index`, `created_at`, `updated_at`) VALUES
('diamondSutra', '金剛般若波羅蜜經', '般若系經典中最著名的經典之一', 2, '2025-07-23 10:42:55', '2025-07-23 10:42:55'),
('heartSutra', '般若波羅蜜多心經', '般若經典的精髓濃縮', 3, '2025-07-23 10:42:55', '2025-07-23 10:42:55'),
('mahaPrajnaparamita', '大般若波羅蜜多經', '般若部重要經典', 1, '2025-07-23 10:42:55', '2025-07-23 10:42:55');

-- --------------------------------------------------------

--
-- 資料表結構 `sections`
--

CREATE TABLE `sections` (
  `id` varchar(255) NOT NULL,
  `chapter_id` varchar(255) NOT NULL COMMENT '所屬章節ID',
  `title` varchar(500) NOT NULL COMMENT '小節標題',
  `theme` varchar(500) DEFAULT NULL COMMENT '主題',
  `outline` text DEFAULT NULL COMMENT '大綱',
  `key_points` text DEFAULT NULL COMMENT '重點',
  `transcript` longtext DEFAULT NULL COMMENT '文稿內容',
  `youtube_id` varchar(255) DEFAULT NULL COMMENT 'YouTube影片ID',
  `order_index` int(11) DEFAULT 0 COMMENT '排序索引',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小節表';

--
-- 傾印資料表的資料 `sections`
--

INSERT INTO `sections` (`id`, `chapter_id`, `title`, `theme`, `outline`, `key_points`, `transcript`, `youtube_id`, `order_index`, `created_at`, `updated_at`) VALUES
('section1_1', 'chapter1', '如是我聞', '法會因緣的殊勝建立', '經典開始，說明法會因緣', '', '', 'dQw4w9WgXcQ', 1, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('section1_1_diamond', 'chapter1_diamond', '如是我聞', '金剛法會的殊勝因緣', '經典開始，說明法會因緣', '1. 舍衛國祇樹給孤獨園是著名的說法道場\n2. 給孤獨長者布金買地供養佛陀的典故\n3. 千二百五十人是佛陀的常隨弟子\n4. 此處為金剛經說法的殊勝因緣', '如是我聞：一時，佛在舍衛國祇樹給孤獨園，與大比丘眾千二百五十人俱...', 'dQw4w9WgXcQ', 1, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('section1_1_heart', 'chapter1_heart', '觀照五蘊皆空', '空性智慧的究竟體證', '觀自在菩薩深般若時，照見五蘊皆空', '1. 觀自在菩薩即觀世音菩薩，代表慈悲與智慧的圓滿\n2. 「行深般若波羅蜜多」指深入修習般若智慧\n3. 五蘊指色、受、想、行、識，涵蓋一切身心現象\n4. 「皆空」不是沒有，而是無自性、無實體\n5. 「度一切苦厄」表示空性智慧能解脫一切痛苦', '觀自在菩薩，行深般若波羅蜜多時，照見五蘊皆空，度一切苦厄...', 'dQw4w9WgXcQ', 1, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('section1_2_heart', 'chapter1_heart', '般若波羅蜜多咒', '神咒功德與彼岸超越', '心經咒語的功德', '1. 「大神咒」表示具有不可思議的神力\n2. 「大明咒」表示能破除無明黑暗\n3. 「無上咒」表示至高無上，無法超越\n4. 「無等等咒」表示無可比擬，獨一無二\n5. 咒語的真實義即是般若智慧本身\n6. 「揭諦揭諦」意為去啊去啊，從此岸到彼岸', '故知般若波羅蜜多，是大神咒，是大明咒，是無上咒，是無等等咒...', 'dQw4w9WgXcQ', 2, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('section2_1_diamond', 'chapter2_diamond', '須菩提請法', '菩提心安住與降伏之道', '須菩提請問如何安住菩提心', '1. 須菩提是解空第一的弟子，最適合問般若法門\n2. 「偏袒右肩，右膝著地」是比丘請法的標準儀軌\n3. 「善男子、善女人」包含了在家與出家眾\n4. 「云何應住」問的是菩提心的安住方法\n5. 「云何降伏其心」問的是煩惱心的對治', '時，長老須菩提在大眾中即從座起，偏袒右肩，右膝著地，合掌恭敬而白佛言...', 'dQw4w9WgXcQ', 1, '2025-07-23 10:42:56', '2025-07-23 10:42:56');

-- --------------------------------------------------------

--
-- 資料表結構 `themes`
--

CREATE TABLE `themes` (
  `id` varchar(255) NOT NULL,
  `section_id` varchar(255) NOT NULL COMMENT '所屬小節ID',
  `name` varchar(500) NOT NULL COMMENT '主題名稱',
  `outline` text DEFAULT NULL COMMENT '主題大綱',
  `key_points` text DEFAULT NULL COMMENT '重點',
  `transcript` longtext DEFAULT NULL COMMENT '文稿內容',
  `youtube_id` varchar(255) DEFAULT NULL COMMENT 'YouTube影片ID',
  `order_index` int(11) DEFAULT 0 COMMENT '排序索引',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='主題表';

--
-- 傾印資料表的資料 `themes`
--

INSERT INTO `themes` (`id`, `section_id`, `name`, `outline`, `key_points`, `transcript`, `youtube_id`, `order_index`, `created_at`, `updated_at`) VALUES
('theme1_1_1', 'section1_1', '佛法傳承的權威建立', '探討「如是我聞」建立經典權威性的深層意義', '1. 「如是我聞」表示親聞佛說，確立經典的權威性\n2. 阿難尊者作為佛陀的侍者，具有第一手的可信度\n3. 此語句在佛經中的標準化意義\n4. 口傳文化中保持法義純正的重要性', '如是我聞：一時，佛在王舍城耆闍崛山中，與大比丘眾千二百五十人俱。此四字為佛經開端，表阿難親聞佛說，非臆測杜撰...', 'dQw4w9WgXcQ', 1, '2025-07-23 10:42:56', '2025-07-23 10:42:56'),
('theme1_1_2', 'section1_1', '德行深化的真義', '解析法會時空背景所蘊含的修行意義', '1. 王舍城耆闍崛山是佛陀常住說法的聖地\n2. 千二百五十人代表固定的僧團規模\n3. 比丘眾的德行水準與法會品質的關係\n4. 時空因緣對法義傳達的重要影響', '王舍城者，摩揭陀國之都城也。耆闍崛山者，鷲峰山也，佛常居此說法。千二百五十人者，皆是大阿羅漢...', 'dQw4w9WgXcQ', 2, '2025-07-23 10:42:56', '2025-07-23 10:42:56');

-- --------------------------------------------------------

--
-- 替換檢視表以便查看 `v_scripture_structure`
-- (請參考以下實際畫面)
--
CREATE TABLE `v_scripture_structure` (
`scripture_id` varchar(255)
,`scripture_name` varchar(500)
,`chapter_id` varchar(255)
,`chapter_name` varchar(500)
,`section_id` varchar(255)
,`section_title` varchar(500)
,`theme_count` bigint(21)
);

-- --------------------------------------------------------

--
-- 檢視表結構 `v_scripture_structure`
--
DROP TABLE IF EXISTS `v_scripture_structure`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_scripture_structure`  AS SELECT `s`.`id` AS `scripture_id`, `s`.`name` AS `scripture_name`, `c`.`id` AS `chapter_id`, `c`.`name` AS `chapter_name`, `sec`.`id` AS `section_id`, `sec`.`title` AS `section_title`, count(`t`.`id`) AS `theme_count` FROM (((`scriptures` `s` left join `chapters` `c` on(`s`.`id` = `c`.`scripture_id`)) left join `sections` `sec` on(`c`.`id` = `sec`.`chapter_id`)) left join `themes` `t` on(`sec`.`id` = `t`.`section_id`)) GROUP BY `s`.`id`, `c`.`id`, `sec`.`id` ORDER BY `s`.`order_index` ASC, `c`.`order_index` ASC, `sec`.`order_index` ASC ;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_scripture_id` (`scripture_id`),
  ADD KEY `idx_order` (`order_index`);

--
-- 資料表索引 `qa`
--
ALTER TABLE `qa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_order` (`order_index`);
ALTER TABLE `qa` ADD FULLTEXT KEY `idx_content` (`question`,`answer`);

--
-- 資料表索引 `scriptures`
--
ALTER TABLE `scriptures`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chapter_id` (`chapter_id`),
  ADD KEY `idx_order` (`order_index`);
ALTER TABLE `sections` ADD FULLTEXT KEY `idx_content` (`title`,`theme`,`outline`,`transcript`);

--
-- 資料表索引 `themes`
--
ALTER TABLE `themes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_section_id` (`section_id`),
  ADD KEY `idx_order` (`order_index`);
ALTER TABLE `themes` ADD FULLTEXT KEY `idx_content` (`name`,`outline`,`transcript`);

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`scripture_id`) REFERENCES `scriptures` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `themes`
--
ALTER TABLE `themes`
  ADD CONSTRAINT `themes_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
