# 选科要求查询系统(重构版)

全国 31 省(自治区、直辖市)普通高校招生专业选考科目要求查询系统。
本版本将旧版 **4400+ 个文件** 重构为 **约 45 个文件** 的数据驱动架构,功能与界面与旧版保持一致,
数据更新方式从"重新生成并上传数千个页面"简化为"替换 31 个数据文件"。

## 数据规模

| 指标 | 数值 |
|---|---|
| 覆盖省份 | 31 |
| 院校数量 | 2,416 |
| 专业记录 | 84,573 |
| 专业名称 | 1,946 |
| 数据文件总量 | 约 3.8 MB |

数据来源于各省教育考试院公开文件(与"高考"项目 /gaokao/ 的开源数据集同源),
已做全国视角清洗:**数据中不含"外省院校"等单一省份视角词条**(主管部门统一归并为
"地方院校 / 中央部委学校"两档)。

## 目录结构

```
university/
├── index.html          # 单页应用入口(含 SEO meta / JSON-LD / PWA)
├── manifest.json       # PWA 清单
├── robots.txt          # 爬虫规则
├── sitemap.xml         # 站点地图(单页,不再有数千个静态页)
├── assets/             # 前端(无构建依赖,原生 JS)
│   ├── style.css       # Swiss/Grid 风格样式(字体接入 Google Fonts CDN)
│   ├── core.js         # 数据层 / 缓存层 / 查询引擎
│   ├── search.js       # 模糊搜索(中文 / 拼音全拼 / 首字母 / 别名 / 纠错)
│   ├── major-query.js  # 专业全能检索模块
│   └── ui.js           # 视图层(7 个视图 + 院校对比)
├── data/               # 全部数据(37 个文件,替代旧版 4400+ 页面)
│   ├── summary.json              # 全站统计(全国口径)
│   ├── provinces.json            # 31 省索引
│   ├── universities.json         # 全国院校索引
│   ├── majors.json               # 全国专业索引(选科占比)
│   ├── search-majors.json        # 搜索引擎·专业索引
│   ├── search-universities.json  # 搜索引擎·院校索引
│   └── {北京,天津,…,新疆}.json    # 31 个省份的紧凑数据
└── tools/
    ├── build_data.py             # 数据构建脚本(更新数据时使用)
    ├── ref_search-majors.json    # 拼音/门类参考表(构建时复用)
    └── ref_search-universities.json
```

## 功能(与旧版一致)

- **省份选择**:按大区浏览 31 省,一键加载(本地缓存 7 天,可预加载全部省份离线使用)
- **院校专业**:按院校浏览全部招生专业选科要求,支持搜索 / 层次筛选 / 排序
- **我的选科**:勾选 3 门科目,实时计算可报比例,标注每个专业"可报 / 受限"
- **选科反查**:12 种选科组合在本省的专业覆盖率一键计算
- **专业查询**:全能检索,支持拼音全拼、拼音首字母(如 lcyx → 临床医学)、简称别名、错别字纠错
- **专业总览**:1,946 个专业全国选科要求分布统计,点击查看跨省详情
- **院校库**:全国 2,416 所院校索引与详情
- **院校对比**:最多 6 所院校按专业对齐比较选科要求差异
- **导出**:任意院校 / 专业的选科清单可复制或导出 CSV
- **深色模式**、键盘快捷键(`/` 搜索、`1-7` 切换视图、`D` 切换主题、`Esc` 关弹层)

## 字体说明

页面通过 Google Fonts CDN 加载 **Inter** 与 **JetBrains Mono**(`display=swap`),
字体加载失败时自动回退到系统字体栈,不阻塞渲染。

## 部署(替换旧版)

旧版 `university/` 下的全部内容(含 `p/ u/ major/ combo/ cat/` 等 4400+ 文件)**全部删除**,
把本目录内容原样上传到仓库 `main` 分支的 `university/` 文件夹即可。例如:

```bash
# 1. 删除旧版(在本地克隆的仓库里)
git rm -r university/

# 2. 放入新版
#    把本目录的 index.html、assets/、data/、manifest.json、
#    robots.txt、sitemap.xml 复制到 university/ 下
cp -r /path/to/new/university/* university/

# 3. 提交推送
git add -A
git commit -m "refactor(university): 数据驱动重构,4419 静态页 → 45 文件"
git push origin main
```

上传后强刷 `https://shuoweb.com/university/`(旧数据有 24h 索引缓存 / 7 天省份数据缓存,
如需立即生效可在浏览器控制台执行 `localStorage.clear()` 或在"关于"页点"清空本地缓存")。

## 数据更新

1. 把新版 31 个省份 JSON(gaokao 项目导出格式,文件名 = `省份.json`)放进 `tools/raw/`;
2. 运行构建:

   ```bash
   cd university/tools
   python3 build_data.py
   ```

3. `data/` 目录自动重建,提交推送即可,无需改动任何前端代码。

## 数据口径

- 选科要求以"招生年份公布的拟招生专业选考科目要求"为准(2027 年起适用);
- 主管部门仅保留有区分度的"中央部委学校",其余统一为"地方院校";
- 仅限个人学习参考,不作为志愿填报最终依据。
