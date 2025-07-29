<?php

// 典籍相關路由
$router->register('scriptures_getAll', 'ScriptureController', 'getAll');
$router->register('scriptures_getById', 'ScriptureController', 'getById');
$router->register('scriptures_search', 'ScriptureController', 'search');
$router->register('scriptures_create', 'ScriptureController', 'create');
$router->register('scriptures_update', 'ScriptureController', 'update');
$router->register('scriptures_delete', 'ScriptureController', 'delete');
$router->register('scriptures_getStructure', 'ScriptureController', 'getStructure');

// 章節相關路由
$router->register('chapters_getAll', 'ChapterController', 'getAll');
$router->register('chapters_getByScriptureId', 'ChapterController', 'getByScriptureId');
$router->register('chapters_getById', 'ChapterController', 'getById');
$router->register('chapters_search', 'ChapterController', 'search');
$router->register('chapters_create', 'ChapterController', 'create');
$router->register('chapters_update', 'ChapterController', 'update');
$router->register('chapters_delete', 'ChapterController', 'delete');
$router->register('chapters_getStructure', 'ChapterController', 'getStructure');

// 小節相關路由
$router->register('sections_getAll', 'SectionController', 'getAll');
$router->register('sections_getByChapterId', 'SectionController', 'getByChapterId');
$router->register('sections_getById', 'SectionController', 'getById');
$router->register('sections_search', 'SectionController', 'search');
$router->register('sections_getByYoutubeId', 'SectionController', 'getByYoutubeId');
$router->register('sections_create', 'SectionController', 'create');
$router->register('sections_update', 'SectionController', 'update');
$router->register('sections_delete', 'SectionController', 'delete');
$router->register('sections_getStructure', 'SectionController', 'getStructure');

// 主題相關路由
$router->register('themes_getAll', 'ThemeController', 'getAll');
$router->register('themes_getBySectionId', 'ThemeController', 'getBySectionId');
$router->register('themes_getById', 'ThemeController', 'getById');
$router->register('themes_search', 'ThemeController', 'search');
$router->register('themes_getByYoutubeId', 'ThemeController', 'getByYoutubeId');
$router->register('themes_create', 'ThemeController', 'create');
$router->register('themes_update', 'ThemeController', 'update');
$router->register('themes_delete', 'ThemeController', 'delete');

// 問答相關路由
$router->register('qa_getAll', 'QAController', 'getAll');
$router->register('qa_getByCategory', 'QAController', 'getByCategory');
$router->register('qa_getById', 'QAController', 'getById');
$router->register('qa_search', 'QAController', 'search');
$router->register('qa_fullTextSearch', 'QAController', 'fullTextSearch');
$router->register('qa_getByTag', 'QAController', 'getByTag');
$router->register('qa_getCategories', 'QAController', 'getCategories');
$router->register('qa_getAllTags', 'QAController', 'getAllTags');
$router->register('qa_getRandom', 'QAController', 'getRandom');
$router->register('qa_create', 'QAController', 'create');
$router->register('qa_update', 'QAController', 'update');
$router->register('qa_delete', 'QAController', 'delete');

// 登入相關路由
$router->register('login', 'LoginController', 'login');

// 修改相關路由
$router->register('createUser', 'LoginController', 'createUser');
$router->register('updatePassword', 'LoginController', 'updatePassword');

?> 