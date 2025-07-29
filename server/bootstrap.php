<?php

// 引入所有必要的類別
require_once __DIR__ . '/lib/DB.php';
require_once __DIR__ . '/lib/Controller.php';
require_once __DIR__ . '/lib/Router.php';

// 引入所有模型
require_once __DIR__ . '/models/Scripture.php';
require_once __DIR__ . '/models/Chapter.php';
require_once __DIR__ . '/models/Section.php';
require_once __DIR__ . '/models/Theme.php';
require_once __DIR__ . '/models/QA.php';
require_once __DIR__ . '/models/Login.php';

// 引入所有控制器
require_once __DIR__ . '/controllers/ScriptureController.php';
require_once __DIR__ . '/controllers/ChapterController.php';
require_once __DIR__ . '/controllers/SectionController.php';
require_once __DIR__ . '/controllers/ThemeController.php';
require_once __DIR__ . '/controllers/QAController.php';
require_once __DIR__ . '/controllers/LoginController.php';

// 初始化資料庫連線（使用現有的 DB.php 設定）
require_once __DIR__ . '/DB.php';

?> 