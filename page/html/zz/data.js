// 政治倾向测试 - 题目 + 人物库 合一
window.PoliticalTest = {
  // 40 道题目
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
    }
  ],

  // 匹配人物
  figures: [
    {
      name: "温和中间派",
      desc: "务实、平衡、不走极端，看情况决策，属于理性稳健型。"
    },
    {
      name: "保守秩序派",
      desc: "重视传统、国家安全、稳定优先，经济偏政府保障。"
    },
    {
      name: "自由民主派",
      desc: "支持开放社会、多元文化、温和市场、国际合作。"
    },
    {
      name: "自由意志主义者",
      desc: "极小政府、完全市场、绝对个人自由。"
    },
    {
      name: "社会主义倾向",
      desc: "强政府干预、高福利、公平优先、集体利益。"
    },
    {
      name: "民族主义者",
      desc: "本国优先、文化传统、强政府、保护本土产业。"
    },
    {
      name: "进步激进派",
      desc: "社会开放、平等主义、政府强力调节分配。"
    }
  ],

  // 匹配逻辑
  match(score) {
    const { economic, social, authority, global } = score;
    if (economic > -5 && economic < 5 &&
        social > -5 && social < 5 &&
        authority > -5 && authority < 5 &&
        global > -5 && global < 5) {
      return this.figures[0];
    }
    if (social <= -5 && authority <= -5 && global <= 0) {
      return this.figures[1];
    }
    if (social >= 5 && global >= 5) {
      return this.figures[2];
    }
    if (economic >= 10 && social >= 10 && authority >= 10) {
      return this.figures[3];
    }
    if (economic <= -10) {
      return this.figures[4];
    }
    if (global <= -10 && social <= -5 && authority <= -5) {
      return this.figures[5];
    }
    if (economic <= -5 && social >= 10) {
      return this.figures[6];
    }
    return {
      name: "独立思考者",
      desc: "你的政治倾向非常独特，不属于常见类型。"
    };
  }
};
