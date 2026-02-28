// 政治倾向测试 - 题目 + 人物库 合一
window.PoliticalTest = {
  // 50 道题目
  questions: [
    {
      "id": 1,
      "text": "经济上，你更支持政府加强干预调控，还是减少干预、让市场自由调节？",
      "options": [
        {"text": "强烈支持政府干预", "score": {"economic": -2}},
        {"text": "偏向政府干预", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向市场自由", "score": {"economic": 1}},
        {"text": "强烈支持市场自由", "score": {"economic": 2}}
      ]
    },
    {
      "id": 2,
      "text": "社会文化方面（婚姻、家庭、传统习俗），你更偏向？",
      "options": [
        {"text": "强烈保守传统", "score": {"social": -2}},
        {"text": "偏向保守", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "偏向开放进步", "score": {"social": 1}},
        {"text": "强烈开放进步", "score": {"social": 2}}
      ]
    },
    {
      "id": 3,
      "text": "国家安全与社会秩序，和个人自由权利，你更看重哪一边？",
      "options": [
        {"text": "强烈优先安全秩序", "score": {"authority": -2}},
        {"text": "偏向安全秩序", "score": {"authority": -1}},
        {"text": "平衡", "score": {"authority": 0}},
        {"text": "偏向个人自由", "score": {"authority": 1}},
        {"text": "强烈优先个人自由", "score": {"authority": 2}}
      ]
    },
    {
      "id": 4,
      "text": "国际事务上，你更偏向本国优先，还是国际合作？",
      "options": [
        {"text": "强烈本国优先", "score": {"global": -2}},
        {"text": "偏向本国利益", "score": {"global": -1}},
        {"text": "中立平衡", "score": {"global": 0}},
        {"text": "偏向国际合作", "score": {"global": 1}},
        {"text": "强烈国际主义", "score": {"global": 2}}
      ]
    },
    {
      "id": 5,
      "text": "你支持对高收入人群征收更高的税率，用于社会福利吗？",
      "options": [
        {"text": "强烈支持", "score": {"economic": -2}},
        {"text": "比较支持", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "不太支持", "score": {"economic": 1}},
        {"text": "强烈反对", "score": {"economic": 2}}
      ]
    },
    {
      "id": 6,
      "text": "你认为公立教育应该完全由政府主导，还是可以市场化竞争？",
      "options": [
        {"text": "强烈政府主导", "score": {"economic": -2}},
        {"text": "偏向政府主导", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向市场化", "score": {"economic": 1}},
        {"text": "强烈市场化", "score": {"economic": 2}}
      ]
    },
    {
      "id": 7,
      "text": "对于网络言论，你认为应该更严格管控，还是更自由？",
      "options": [
        {"text": "强烈严格管控", "score": {"authority": -2}},
        {"text": "偏向严格", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向自由", "score": {"authority": 1}},
        {"text": "强烈自由", "score": {"authority": 2}}
      ]
    },
    {
      "id": 8,
      "text": "移民政策应该更开放，还是更收紧？",
      "options": [
        {"text": "强烈收紧", "score": {"global": -2}},
        {"text": "偏向收紧", "score": {"global": -1}},
        {"text": "中立", "score": {"global": 0}},
        {"text": "偏向开放", "score": {"global": 1}},
        {"text": "强烈开放", "score": {"global": 2}}
      ]
    },
    {
      "id": 9,
      "text": "医疗体系应该以免费公立为主，还是允许市场化盈利？",
      "options": [
        {"text": "强烈公立免费", "score": {"economic": -2}},
        {"text": "偏向公立", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向市场", "score": {"economic": 1}},
        {"text": "强烈市场化", "score": {"economic": 2}}
      ]
    },
    {
      "id": 10,
      "text": "你支持在公共场合严格维护传统礼仪吗？",
      "options": [
        {"text": "强烈支持", "score": {"social": -2}},
        {"text": "比较支持", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "不太支持", "score": {"social": 1}},
        {"text": "完全不支持", "score": {"social": 2}}
      ]
    },
    {
      "id": 11,
      "text": "企业监管应该更严格，还是更宽松？",
      "options": [
        {"text": "强烈更严格", "score": {"economic": -2}},
        {"text": "偏向严格", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向宽松", "score": {"economic": 1}},
        {"text": "强烈更宽松", "score": {"economic": 2}}
      ]
    },
    {
      "id": 12,
      "text": "社会应该更强调集体利益，还是个人权利？",
      "options": [
        {"text": "强烈集体利益", "score": {"authority": -2}},
        {"text": "偏向集体", "score": {"authority": -1}},
        {"text": "平衡", "score": {"authority": 0}},
        {"text": "偏向个人", "score": {"authority": 1}},
        {"text": "强烈个人权利", "score": {"authority": 2}}
      ]
    },
    {
      "id": 13,
      "text": "应对气候变化，应该由全球统一强力行动，还是各国自主决定？",
      "options": [
        {"text": "强烈全球统一行动", "score": {"global": 2}},
        {"text": "偏向全球协作", "score": {"global": 1}},
        {"text": "中立", "score": {"global": 0}},
        {"text": "偏向各国自主", "score": {"global": -1}},
        {"text": "强烈各国自主", "score": {"global": -2}}
      ]
    },
    {
      "id": 14,
      "text": "你支持更多元的性别观念与家庭形式吗？",
      "options": [
        {"text": "强烈不支持", "score": {"social": -2}},
        {"text": "不太支持", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "比较支持", "score": {"social": 1}},
        {"text": "强烈支持", "score": {"social": 2}}
      ]
    },
    {
      "id": 15,
      "text": "政府应该大量提供廉租房、保障房吗？",
      "options": [
        {"text": "强烈应该", "score": {"economic": -2}},
        {"text": "比较应该", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "不太应该", "score": {"economic": 1}},
        {"text": "完全不应该", "score": {"economic": 2}}
      ]
    },
    {
      "id": 16,
      "text": "司法系统应该更强调效率和维稳，还是程序正义和人权？",
      "options": [
        {"text": "强烈效率维稳", "score": {"authority": -2}},
        {"text": "偏向效率", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向程序正义", "score": {"authority": 1}},
        {"text": "强烈程序正义", "score": {"authority": 2}}
      ]
    },
    {
      "id": 17,
      "text": "对外贸易与投资，应该更保护本国产业，还是更开放？",
      "options": [
        {"text": "强烈保护本国", "score": {"global": -2}},
        {"text": "偏向保护", "score": {"global": -1}},
        {"text": "中立", "score": {"global": 0}},
        {"text": "偏向开放", "score": {"global": 1}},
        {"text": "强烈开放", "score": {"global": 2}}
      ]
    },
    {
      "id": 18,
      "text": "流行文化应该更多弘扬传统，还是鼓励创新多元？",
      "options": [
        {"text": "强烈弘扬传统", "score": {"social": -2}},
        {"text": "偏向传统", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "偏向多元创新", "score": {"social": 1}},
        {"text": "强烈多元创新", "score": {"social": 2}}
      ]
    },
    {
      "id": 19,
      "text": "最低工资标准应该大幅提高并严格执行吗？",
      "options": [
        {"text": "强烈支持", "score": {"economic": -2}},
        {"text": "比较支持", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "不太支持", "score": {"economic": 1}},
        {"text": "强烈反对", "score": {"economic": 2}}
      ]
    },
    {
      "id": 20,
      "text": "总体上，你更信任大政府，还是更信任公民社会？",
      "options": [
        {"text": "强烈信任大政府", "score": {"authority": -2}},
        {"text": "偏向政府", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向公民社会", "score": {"authority": 1}},
        {"text": "强烈信任公民社会", "score": {"authority": 2}}
      ]
    },
    {
      "id": 21,
      "text": "你支持全民基本收入（无条件发钱）吗？",
      "options": [
        {"text": "强烈支持", "score": {"economic": -2}},
        {"text": "偏向支持", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向反对", "score": {"economic": 1}},
        {"text": "强烈反对", "score": {"economic": 2}}
      ]
    },
    {
      "id": 22,
      "text": "学校教育应更强调爱国主义，还是普世价值？",
      "options": [
        {"text": "强烈爱国主义", "score": {"global": -2}},
        {"text": "偏向爱国", "score": {"global": -1}},
        {"text": "平衡", "score": {"global": 0}},
        {"text": "偏向普世价值", "score": {"global": 1}},
        {"text": "强烈普世价值", "score": {"global": 2}}
      ]
    },
    {
      "id": 23,
      "text": "你支持毒品合法化（仅限软性毒品）吗？",
      "options": [
        {"text": "强烈反对", "score": {"social": -2}},
        {"text": "偏向反对", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "偏向支持", "score": {"social": 1}},
        {"text": "强烈支持", "score": {"social": 2}}
      ]
    },
    {
      "id": 24,
      "text": "大型科技公司（互联网平台）应被国家强力监管甚至拆分吗？",
      "options": [
        {"text": "强烈支持拆分监管", "score": {"economic": -2}},
        {"text": "偏向加强监管", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "少监管", "score": {"economic": 1}},
        {"text": "完全不干预", "score": {"economic": 2}}
      ]
    },
    {
      "id": 25,
      "text": "你支持安乐死合法化吗？",
      "options": [
        {"text": "强烈反对", "score": {"social": -2}},
        {"text": "偏向反对", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "偏向支持", "score": {"social": 1}},
        {"text": "强烈支持", "score": {"social": 2}}
      ]
    },
    {
      "id": 26,
      "text": "社会福利应该按需分配，还是按劳分配？",
      "options": [
        {"text": "强烈按需分配", "score": {"economic": -2}},
        {"text": "偏向按需", "score": {"economic": -1}},
        {"text": "平衡", "score": {"economic": 0}},
        {"text": "偏向按劳", "score": {"economic": 1}},
        {"text": "强烈按劳分配", "score": {"economic": 2}}
      ]
    },
    {
      "id": 27,
      "text": "你支持加强监控来预防犯罪吗？",
      "options": [
        {"text": "强烈支持", "score": {"authority": -2}},
        {"text": "偏向支持", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向反对", "score": {"authority": 1}},
        {"text": "强烈反对", "score": {"authority": 2}}
      ]
    },
    {
      "id": 28,
      "text": "文化产品应优先审查三观正确性，还是创作自由？",
      "options": [
        {"text": "强烈优先审查", "score": {"social": -2}},
        {"text": "偏向审查", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "偏向创作自由", "score": {"social": 1}},
        {"text": "强烈创作自由", "score": {"social": 2}}
      ]
    },
    {
      "id": 29,
      "text": "你支持自由贸易区、全球化经济吗？",
      "options": [
        {"text": "强烈反对", "score": {"global": -2}},
        {"text": "偏向反对", "score": {"global": -1}},
        {"text": "中立", "score": {"global": 0}},
        {"text": "偏向支持", "score": {"global": 1}},
        {"text": "强烈支持", "score": {"global": 2}}
      ]
    },
    {
      "id": 30,
      "text": "私有财产神圣不可侵犯，你认同吗？",
      "options": [
        {"text": "完全不认同", "score": {"economic": -2}},
        {"text": "不太认同", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "比较认同", "score": {"economic": 1}},
        {"text": "强烈认同", "score": {"economic": 2}}
      ]
    },
    {
      "id": 31,
      "text": "你支持强制服兵役吗？",
      "options": [
        {"text": "强烈支持", "score": {"authority": -2}},
        {"text": "偏向支持", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向反对", "score": {"authority": 1}},
        {"text": "强烈反对", "score": {"authority": 2}}
      ]
    },
    {
      "id": 32,
      "text": "你支持宗教进入公共教育体系吗？",
      "options": [
        {"text": "强烈支持", "score": {"social": -2}},
        {"text": "偏向支持", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "偏向反对", "score": {"social": 1}},
        {"text": "强烈反对", "score": {"social": 2}}
      ]
    },
    {
      "id": 33,
      "text": "政府应补贴本土企业，对抗外国竞争吗？",
      "options": [
        {"text": "强烈应该", "score": {"global": -2}},
        {"text": "偏向应该", "score": {"global": -1}},
        {"text": "中立", "score": {"global": 0}},
        {"text": "不太应该", "score": {"global": 1}},
        {"text": "完全不应该", "score": {"global": 2}}
      ]
    },
    {
      "id": 34,
      "text": "你支持减少甚至取消死刑吗？",
      "options": [
        {"text": "强烈反对", "score": {"authority": -2}},
        {"text": "偏向反对", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向支持", "score": {"authority": 1}},
        {"text": "强烈支持", "score": {"authority": 2}}
      ]
    },
    {
      "id": 35,
      "text": "你支持全面免费高等教育吗？",
      "options": [
        {"text": "强烈支持", "score": {"economic": -2}},
        {"text": "偏向支持", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向反对", "score": {"economic": 1}},
        {"text": "强烈反对", "score": {"economic": 2}}
      ]
    },
    {
      "id": 36,
      "text": "社会应更强调传统家庭结构吗？",
      "options": [
        {"text": "强烈强调", "score": {"social": -2}},
        {"text": "偏向强调", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "不太强调", "score": {"social": 1}},
        {"text": "完全不强调", "score": {"social": 2}}
      ]
    },
    {
      "id": 37,
      "text": "你支持政府直接定价水、电、燃气等民生商品吗？",
      "options": [
        {"text": "强烈支持", "score": {"economic": -2}},
        {"text": "偏向支持", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向市场定价", "score": {"economic": 1}},
        {"text": "完全市场定价", "score": {"economic": 2}}
      ]
    },
    {
      "id": 38,
      "text": "你支持公民可以合法持有枪支吗？",
      "options": [
        {"text": "强烈反对", "score": {"authority": -2}},
        {"text": "偏向反对", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向支持", "score": {"authority": 1}},
        {"text": "强烈支持", "score": {"authority": 2}}
      ]
    },
    {
      "id": 39,
      "text": "你支持国际组织（如联合国）拥有更高权威吗？",
      "options": [
        {"text": "强烈反对", "score": {"global": -2}},
        {"text": "偏向反对", "score": {"global": -1}},
        {"text": "中立", "score": {"global": 0}},
        {"text": "偏向支持", "score": {"global": 1}},
        {"text": "强烈支持", "score": {"global": 2}}
      ]
    },
    {
      "id": 40,
      "text": "你认为社会变革应循序渐进，还是激进革新？",
      "options": [
        {"text": "强烈保守渐进", "score": {"social": -2}},
        {"text": "偏向渐进", "score": {"social": -1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "偏向激进", "score": {"social": 1}},
        {"text": "强烈激进革新", "score": {"social": 2}}
      ]
    },
    // 以下为新增的10道深度题目
    {
      "id": 41,
      "text": "加密货币和去中心化金融应该被政府严厉管控吗？",
      "options": [
        {"text": "强烈支持严管", "score": {"economic": -2, "authority": -1}},
        {"text": "偏向适度管控", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向自由发展", "score": {"economic": 1}},
        {"text": "绝对自由，反抗金融霸权", "score": {"economic": 2, "authority": 1}}
      ]
    },
    {
      "id": 42,
      "text": "面对跨国公司避税，你支持推动全球统一的最低企业税率吗？",
      "options": [
        {"text": "强烈支持全球统一", "score": {"global": 2, "economic": -1}},
        {"text": "偏向支持", "score": {"global": 1}},
        {"text": "中立", "score": {"global": 0}},
        {"text": "偏向本国按需定税", "score": {"global": -1}},
        {"text": "坚决反对全球施压", "score": {"global": -2, "economic": 1}}
      ]
    },
    {
      "id": 43,
      "text": "为了环保，是否应该用法律手段强制推行严苛的垃圾分类和碳排放限制？",
      "options": [
        {"text": "强烈支持强制", "score": {"authority": -2, "social": 1}},
        {"text": "偏向支持", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向鼓励而非强制", "score": {"authority": 1}},
        {"text": "强烈反对行政干预生活", "score": {"authority": 2, "social": -1}}
      ]
    },
    {
      "id": 44,
      "text": "面对全球难民危机，本国是否应该无条件承担更多接收义务？",
      "options": [
        {"text": "完全应该，无国界互助", "score": {"global": 2, "social": 2}},
        {"text": "偏向承担更多", "score": {"global": 1}},
        {"text": "量力而行", "score": {"global": 0}},
        {"text": "偏向收紧接收", "score": {"global": -1}},
        {"text": "绝对反对，本国优先", "score": {"global": -2, "social": -1}}
      ]
    },
    {
      "id": 45,
      "text": "遇到重大公共卫生危机（如疫情），政府有权强制封锁限制居民出行吗？",
      "options": [
        {"text": "绝对有权，集体生命至上", "score": {"authority": -2}},
        {"text": "特殊时期可以理解", "score": {"authority": -1}},
        {"text": "中立", "score": {"authority": 0}},
        {"text": "偏向保障个人自由", "score": {"authority": 1}},
        {"text": "绝对无权，自由神圣不可侵犯", "score": {"authority": 2}}
      ]
    },
    {
      "id": 46,
      "text": "铁路、通信、水务等核心基础设施，必须由国家绝对控股吗？",
      "options": [
        {"text": "必须绝对控股", "score": {"economic": -2}},
        {"text": "偏向国家主导", "score": {"economic": -1}},
        {"text": "混合制", "score": {"economic": 0}},
        {"text": "偏向私有化竞争", "score": {"economic": 1}},
        {"text": "完全私有化效率更高", "score": {"economic": 2}}
      ]
    },
    {
      "id": 47,
      "text": "中小学是否应该全面推行性教育及多元性别认同教育？",
      "options": [
        {"text": "强烈支持全面推行", "score": {"social": 2}},
        {"text": "偏向支持适度普及", "score": {"social": 1}},
        {"text": "中立", "score": {"social": 0}},
        {"text": "偏向保留传统生物常识即可", "score": {"social": -1}},
        {"text": "强烈反对，保护儿童免受过度引导", "score": {"social": -2}}
      ]
    },
    {
      "id": 48,
      "text": "媒体记者是否应该拥有特权，拒绝向警方透露可能涉及犯罪的消息来源？",
      "options": [
        {"text": "绝对应该，新闻自由至上", "score": {"authority": 2}},
        {"text": "偏向保护记者", "score": {"authority": 1}},
        {"text": "看具体情况", "score": {"authority": 0}},
        {"text": "偏向配合司法调查", "score": {"authority": -1}},
        {"text": "绝对不应该，国家安全优先", "score": {"authority": -2}}
      ]
    },
    {
      "id": 49,
      "text": "对于意识形态完全不同甚至对立的国家，本国应该实施经济制裁还是保持经贸往来？",
      "options": [
        {"text": "强烈支持制裁与脱钩", "score": {"global": -2}},
        {"text": "偏向施压防御", "score": {"global": -1}},
        {"text": "中立务实", "score": {"global": 0}},
        {"text": "偏向求同存异", "score": {"global": 1}},
        {"text": "坚决反对政治干预经济", "score": {"global": 2}}
      ]
    },
    {
      "id": 50,
      "text": "你是否赞同对富人征收极高的“遗产税”，以防止财富世袭和阶层固化？",
      "options": [
        {"text": "强烈赞同，追求起点公平", "score": {"economic": -2}},
        {"text": "偏向赞同", "score": {"economic": -1}},
        {"text": "中立", "score": {"economic": 0}},
        {"text": "偏向反对", "score": {"economic": 1}},
        {"text": "强烈反对，财富支配权属于个人", "score": {"economic": 2}}
      ]
    }
  ],

  // 匹配人物库（带有目标雷达坐标的扩展版）
  // 坐标轴逻辑：economic(左-右+), social(保守-开放+), authority(威权-自由+), global(本国-全球+),GPT生成，不要胡说哦
  figures: [
    {
      name: "温和中间派 (Centrist)",
      target: { economic: 0, social: 0, authority: 0, global: 0 },
      desc: "务实、平衡、不走极端，看情况决策，属于理性稳健型。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：安格拉·默克尔 (Angela Merkel)</span>"
    },
    {
      name: "保守秩序派 (Conservative)",
      target: { economic: 5, social: -15, authority: -15, global: -10 },
      desc: "重视传统价值、国家安全与社会秩序，经济上偏向温和市场。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：温斯顿·丘吉尔 (Winston Churchill)</span>"
    },
    {
      name: "自由民主派 (Liberal)",
      target: { economic: 5, social: 15, authority: 10, global: 15 },
      desc: "支持开放社会、多元文化、温和的市场经济与广泛的国际合作。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：约翰·肯尼迪 (John F. Kennedy)</span>"
    },
    {
      name: "自由意志主义者 (Libertarian)",
      target: { economic: 20, social: 15, authority: 20, global: 5 },
      desc: "极小政府、完全自由市场、绝对的个人权利，反感任何形式的公权力扩张。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：米尔顿·弗里德曼 (Milton Friedman)</span>"
    },
    {
      name: "传统社会主义者 (State Socialist)",
      target: { economic: -20, social: -5, authority: -15, global: 5 },
      desc: "强调大政府干预、资源集中分配与高福利，追求绝对的经济平等，社会观念偏向保守秩序。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：克莱门特·艾德礼 (Clement Attlee)</span>"
    },
    {
      name: "民族主义者 (Nationalist)",
      target: { economic: 0, social: -15, authority: -15, global: -20 },
      desc: "本国利益绝对优先，强调文化传统、强人政治，主张保护本土产业免受外部冲击。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：夏尔·戴高乐 (Charles de Gaulle)</span>"
    },
    {
      name: "进步激进派 (Progressive)",
      target: { economic: -15, social: 20, authority: 10, global: 15 },
      desc: "极度强调社会多元开放与弱势群体平权，主张政府强力调节财富分配以消除不公。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：伯尼·桑德斯 (Bernie Sanders)</span>"
    },
    {
      name: "新自由主义者 (Neoliberal)",
      target: { economic: 20, social: 5, authority: 0, global: 20 },
      desc: "坚信全球化和自由贸易，主张私有化、去监管和效率优先，用市场手段解决一切问题。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：玛格丽特·撒切尔 (Margaret Thatcher)</span>"
    },
    {
      name: "民主社会主义者 (Democratic Socialist)",
      target: { economic: -15, social: 15, authority: 15, global: 10 },
      desc: "经济上追求高税收高福利（北欧模式），政治社会上追求极高的民主与个人自由。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：乔治·奥威尔 (George Orwell) / 典型北欧政客</span>"
    },
    {
      name: "威权资本主义者 (Authoritarian Capitalist)",
      target: { economic: 15, social: -10, authority: -20, global: -5 },
      desc: "经济上高度允许资本逐利与市场竞争，但政治和社会层面采取铁腕高压管控。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：奥古斯托·皮诺切特 / 李光耀(早期)</span>"
    },
{
      name: "社会自由主义者 (Social Liberal)",
      target: { economic: -5, social: 18, authority: 12, global: 15 },
      desc: "支持福利国家与个人自由并存，强调机会公平与社会包容。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：贾斯廷·特鲁多 (Justin Trudeau)</span>"
    },
    {
      name: "古典自由主义者 (Classical Liberal)",
      target: { economic: 15, social: 10, authority: 15, global: 10 },
      desc: "强调个人权利、法治与自由市场，是现代自由主义的历史源头。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：约翰·洛克 (John Locke)</span>"
    },
    {
      name: "社会民主主义者 (Social Democrat)",
      target: { economic: -12, social: 12, authority: 8, global: 12 },
      desc: "支持资本主义框架下的高福利制度与强社会保障。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：奥洛夫·帕尔梅 (Olof Palme)</span>"
    },
    {
      name: "技术官僚主义 (Technocrat)",
      target: { economic: 5, social: 5, authority: -5, global: 10 },
      desc: "相信专家治理与数据决策，减少意识形态影响公共政策。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：马里奥·德拉吉 (Mario Draghi)</span>"
    },
    {
      name: "威权社会主义 (Authoritarian Socialist)",
      target: { economic: -20, social: -10, authority: -25, global: -5 },
      desc: "强调国家控制经济与社会，通过强权实现集体主义目标。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：约瑟夫·斯大林 (Joseph Stalin)</span>"
    },
    {
      name: "右翼民粹主义 (Right Populist)",
      target: { economic: 5, social: -20, authority: -10, global: -20 },
      desc: "强调民族认同与反精英政治，主张强烈本国优先政策。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：唐纳德·特朗普 (Donald Trump)</span>"
    },
    {
      name: "左翼民粹主义 (Left Populist)",
      target: { economic: -18, social: 10, authority: -5, global: 5 },
      desc: "反对经济精英与资本垄断，强调人民主权与财富再分配。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：雨果·查韦斯 (Hugo Chávez)</span>"
    },
    {
      name: "绿色政治 (Green Politics)",
      target: { economic: -10, social: 20, authority: 10, global: 20 },
      desc: "环保优先，支持可持续发展与全球生态合作。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：佩特拉·凯利 (Petra Kelly)</span>"
    },
    {
      name: "市场社会主义 (Market Socialist)",
      target: { economic: -10, social: 10, authority: 5, global: 10 },
      desc: "结合市场机制与社会所有制，追求效率与公平平衡。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：奥斯卡·兰格 (Oskar Lange)</span>"
    },
    {
      name: "国家资本主义 (State Capitalist)",
      target: { economic: 10, social: -5, authority: -20, global: -5 },
      desc: "国家主导关键产业，同时允许市场竞争与资本运作。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：邓小平 (Deng Xiaoping)</span>"
    },
    {
      name: "君主保守主义 (Monarchist Conservative)",
      target: { economic: 0, social: -20, authority: -25, global: -10 },
      desc: "强调传统等级秩序与国家统一，支持君主或强象征权威。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：奥托·冯·俾斯麦 (Otto von Bismarck)</span>"
    },
    {
      name: "无政府资本主义 (Anarcho-Capitalist)",
      target: { economic: 25, social: 15, authority: 25, global: 10 },
      desc: "反对国家存在，认为市场与私人契约可替代政府。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：默里·罗斯巴德 (Murray Rothbard)</span>"
    },
    {
      name: "无政府共产主义 (Anarcho-Communist)",
      target: { economic: -25, social: 20, authority: 25, global: 15 },
      desc: "追求无国家、无阶级社会，资源共同所有与自治社区。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：彼得·克鲁泡特金 (Peter Kropotkin)</span>"
    },
    {
      name: "民族保守主义 (National Conservative)",
      target: { economic: 5, social: -18, authority: -12, global: -18 },
      desc: "结合民族主义与传统价值，反对全球主义文化影响。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：维克托·欧尔班 (Viktor Orbán)</span>"
    },
    {
      name: "自由全球主义 (Globalist Liberal)",
      target: { economic: 15, social: 15, authority: 10, global: 25 },
      desc: "支持开放边界、自由贸易与全球治理结构。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：托尼·布莱尔 (Tony Blair)</span>"
    },
    {
      name: "革命马克思主义 (Revolutionary Marxist)",
      target: { economic: -25, social: 5, authority: -15, global: 10 },
      desc: "主张通过革命推翻资本主义制度建立无阶级社会。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：列夫·托洛茨基 (Leon Trotsky)</span>"
    },
    {
      name: "温和保守自由派 (Moderate Conservative Liberal)",
      target: { economic: 10, social: -5, authority: 5, global: 5 },
      desc: "支持市场经济与有限传统价值，强调渐进改革。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：戴维·卡梅伦 (David Cameron)</span>"
    },
    {
      name: "数字自由主义 (Digital Libertarian)",
      target: { economic: 18, social: 18, authority: 22, global: 15 },
      desc: "强调互联网自由、隐私权与去中心化技术改变社会结构。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：爱德华·斯诺登 (Edward Snowden)</span>"
    },
    {
      name: "发展主义国家派 (Developmentalist)",
      target: { economic: -5, social: -5, authority: -10, global: 5 },
      desc: "国家主导工业化与经济发展，以增长优先于意识形态。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：朴正熙 (Park Chung-hee)</span>"
    },
    {
      name: "务实现实主义 (Realist Pragmatist)",
      target: { economic: 5, social: 0, authority: -5, global: -5 },
      desc: "强调国家利益与现实政治，反对理想主义外交。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：亨利·基辛格 (Henry Kissinger)</span>"
    },
    {
      name: "生态无政府主义 (Eco-Anarchist)",
      target: { economic: -15, social: 20, authority: 20, global: 10 },
      desc: "反对资本主义工业化，反感国家机器，主张人类应退回去中心化、高度环保的自治社区。<br><br><span style='display:block;margin-top:10px;font-size:14px;color:var(--text-sub);'>✦ <b>相似代表人物</b>：默里·布克钦 (Murray Bookchin)</span>"
    }
  ],

  // 全新升级的匹配逻辑：多维空间距离算法 (最近邻搜索)
  // 彻底废除原版死板的 if-else，保证绝对能匹配到最契合的流派，不会再出现匹配失败的情况。
  match(score) {
    let bestMatch = null;
    let minDistance = Infinity; // 初始距离设为无限大

    // 遍历人物库，计算用户得分坐标与各流派理想坐标的“欧几里得距离”
    for (let i = 0; i < this.figures.length; i++) {
      let figure = this.figures[i];
      let distance = 
        Math.pow(score.economic - figure.target.economic, 2) +
        Math.pow(score.social - figure.target.social, 2) +
        Math.pow(score.authority - figure.target.authority, 2) +
        Math.pow(score.global - figure.target.global, 2);

      // 距离越小，说明匹配度越高
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = figure;
      }
    }

    // 返回最佳匹配结果给 HTML 渲染
    return bestMatch;
  }
};
