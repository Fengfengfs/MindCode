export const childrenMockData = {
  name: 'vote-page',
  type: 'folder',
  description: '投票页面组件',
  time: 2,
  children: [
    {
      name: 'VotePage.tsx',
      type: 'file',
      description: '投票页面主组件',
      time: 0.5,
    },
    {
      name: 'VoteItem.tsx',
      type: 'file',
      description: '投票项组件',
      time: 0.5,
    },
    {
      name: 'VoteResult.tsx',
      type: 'file',
      description: '投票结果组件',
      time: 0.5,
    },
    {
      name: 'VoteForm.tsx',
      type: 'file',
      description: '投票表单组件',
      time: 0.5,
    },
    {
      name: 'styles',
      type: 'folder',
      description: '样式文件夹',
      time: 0,
      children: [
        {
          name: 'VotePage.css',
          type: 'file',
          description: '投票页面样式',
          time: 0.25,
        },
        {
          name: 'VoteItem.css',
          type: 'file',
          description: '投票项样式',
          time: 0.25,
        },
      ],
    },
  ],
}

export const mockData = {
  name: 'src',
  type: 'folder',
  description: '源代码目录',
  children: [
    {
      name: 'test',
      type: 'folder',
      description: '公共组件目录',
      children: [
        {
          name: 'vote-page',
          type: 'folder',
          description: '投票页面组件',
          id: 5,
          time: 2,
        },
        {
          name: 'Header.tsx',
          type: 'file',
          description: '头部组件',
          id: 2,
          time: 0.5,
        },
        {
          name: 'Footer.tsx',
          type: 'file',
          description: '底部组件',
          id: 3,
          time: 0.5,
        },
      ],
    },
    {
      name: 'pages',
      type: 'folder',
      description: '页面目录',
      children: [
        {
          name: 'Home.tsx',
          type: 'file',
          description: '主页组件',
          id: 4,
          time: 1,
        },
      ],
    },
    {
      name: 'App.tsx',
      type: 'file',
      description: '应用主组件',
      id: 1,
      time: 0.5,
    },
    {
      name: 'index.tsx',
      type: 'file',
      description: '应用入口文件',
      id: 6,
      time: 0.5,
    },
  ],
}
