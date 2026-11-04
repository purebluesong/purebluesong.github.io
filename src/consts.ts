// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'purebluesong';
export const SITE_AUTHOR = '瑞鹏';
export const SITE_DESCRIPTION =
	'瑞鹏的个人站点 — 个人思考、信息整合、作品展示，以及公开可查的个人信息。';
export const GITHUB_USER = 'purebluesong';
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

export const SECTIONS = [
	{
		href: '/thoughts/',
		label: '个人思考',
		nav: '思考',
		blurb: '随手记下正在想的事，技术与日常都算。',
	},
	{
		href: '/hub/',
		label: '信息整合',
		nav: '整合',
		blurb: '把散落的材料收成可查的静态条目，慢慢加厚。',
	},
	{
		href: '/works/',
		label: '个人作品展示',
		nav: '作品',
		blurb: '站点、小游戏，以及值得留下来的小制作。',
	},
	{
		href: '/about/',
		label: '个人信息',
		nav: '关于',
		blurb: '仅展示 GitHub 上公开可见的简介与链接。',
	},
] as const;
