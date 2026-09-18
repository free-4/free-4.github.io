#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_data.py — 选科要求查询系统 · 数据构建脚本
================================================
把 raw/ 目录下 31 个省份的原始数据(gaokao 项目格式)构建成
university/data/ 所需的全部数据文件。

新的存储类型:整个站点只需 1 个 index.html + 5 个前端文件 + 约 37 个数据文件,
不再生成 4400+ 个静态页面。数据更新时只需:
  1) 把新版 31 个省份 JSON 放进 raw/(文件名 = 省份名.json,gaokao 项目导出格式)
  2) python3 tools/build_data.py
  3) 把 university/ 目录整体上传覆盖即可

输入:raw/{省份}.json — 结构:
  { "元数据": {...}, "统计": {...},
    "院校列表": [ { 院校代码, 院校名称, 院校所在地, 主管部门, 学历层次,
                    专业列表: [ { 学历层次, 专业名称, 选考科目要求 }, ... ] }, ... ] }

输出:data/ 目录
  summary.json                 全站统计(全国口径)
  provinces.json               31 省索引(省份/大区/院校数/记录数/去重专业数)
  universities.json            全国院校索引 [代码,名称,所在地,主管部门,覆盖省份数,记录数,[省份]]
  majors.json                  全国专业索引 [名称,记录数,省份数,院校数,不限%,物%,化%,生%,政%,史%,地%]
  search-majors.json           搜索引擎专业索引 {n,p,s,a,c,r,cat}
  search-universities.json     搜索引擎院校索引 {n,p,s,a,v,r,prov}
  {省份}.json × 31             每省紧凑数据 {省份,要求字典,院校}

数据清洗(面向全国,不带任何单一省份视角):
  * 主管部门「外省地方院校」→「地方院校」,数据中不保留「外省」字样
  * 元信息不写入「拟在皖招生」等表述,统一为全国口径说明
"""
import json
import os
import sys
from collections import Counter, defaultdict
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)   # 项目根(university/)
RAW = os.path.join(HERE, 'raw')
OUT = os.path.join(ROOT, 'data')

PROVINCES = ['北京','天津','河北','山西','内蒙古','辽宁','吉林','黑龙江',
             '上海','江苏','浙江','安徽','福建','江西','山东',
             '河南','湖北','湖南',
             '广东','广西','海南',
             '重庆','四川','贵州','云南','西藏',
             '陕西','甘肃','青海','宁夏','新疆']

REGION = {
    '华北': ['北京','天津','河北','山西','内蒙古'],
    '东北': ['辽宁','吉林','黑龙江'],
    '华东': ['上海','江苏','浙江','安徽','福建','江西','山东'],
    '华中': ['河南','湖北','湖南'],
    '华南': ['广东','广西','海南'],
    '西南': ['重庆','四川','贵州','云南','西藏'],
    '西北': ['陕西','甘肃','青海','宁夏','新疆'],
}
PROV2REGION = {p: r for r, ps in REGION.items() for p in ps}

SUBJECT_KEYS = ['物理', '化学', '生物', '政治', '历史', '地理']
# 数据中出现的科目表述 → 统计键
SUBJ_NORMALIZE = {'思想政治': '政治', '政治': '政治'}

def clean_dept(dept):
    """主管部门清洗:去掉「外省」视角词条。"""
    d = str(dept or '').strip()
    if '外省' in d:
        d = d.replace('外省', '')
        if not d:
            d = '地方院校'
    return d or '地方院校'

def parse_req(text):
    """解析选考科目要求 → (mode, subjects)
    mode 0 = 不限;1 = 单科任选其一即可;2/3 = 均须选考"""
    t = str(text or '').strip()
    if not t or '不提科目要求' in t:
        return 0, []
    subs = []
    for k in ['物理', '化学', '生物', '思想政治', '政治', '历史', '地理', '技术']:
        if k in t and k not in subs:
            subs.append('政治' if k == '思想政治' else k)
    mode = len(subs)
    if '1门' in t: mode = 1
    elif '2门' in t: mode = 2
    elif '3门' in t: mode = 3
    return mode, subs

def main():
    os.makedirs(OUT, exist_ok=True)
    generated = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # 原版搜索索引(复用拼音 / 别名 / 门类)
    ref_major = {}
    ref_uni = {}
    try:
        ref = json.load(open(os.path.join(ROOT, 'ref_search-majors.json'), encoding='utf-8'))
        for i, n in enumerate(ref['n']):
            ref_major[n] = {'p': ref['p'][i], 's': ref['s'][i], 'a': ref['a'][i], 'c': ref['c'][i]}
        ref_cat = ref['cat']
        print(f'参考门类表: {ref_cat}')
    except Exception as e:
        ref_cat = []
        print(f'[warn] 未找到 ref_search-majors.json,门类将归入「其他」({e})')
    try:
        ru = json.load(open(os.path.join(ROOT, 'ref_search-universities.json'), encoding='utf-8'))
        for i, n in enumerate(ru['n']):
            ref_uni[n] = {'p': ru['p'][i], 's': ru['s'][i], 'a': ru['a'][i]}
    except Exception as e:
        print(f'[warn] 未找到 ref_search-universities.json,院校拼音为空({e})')

    prov_index = []
    all_unis = {}        # code -> {name, loc, dept, provs:set, recs:int, level}
    major_stat = {}      # name -> {'recs':int,'provs':set,'unis':set,'subj':Counter,'unlimited':int,'cat':str}
    total_recs = 0

    for prov in PROVINCES:
        fn = os.path.join(RAW, prov + '.json')
        if not os.path.exists(fn):
            print(f'[error] 缺少 {fn},终止'); sys.exit(1)
        data = json.load(open(fn, encoding='utf-8'))
        unis = data.get('院校列表', [])

        # —— 省内要求字典 ——
        req_counter = Counter()
        for u in unis:
            for m in u.get('专业列表', []):
                req_counter[str(m.get('选考科目要求', '') or '不提科目要求').strip() or '不提科目要求'] += 1
        req_dict = [r for r, _ in req_counter.most_common()]
        req_idx = {r: i for i, r in enumerate(req_dict)}

        compact_unis = []
        for u in unis:
            code = str(u.get('院校代码', '')).strip()
            name = str(u.get('院校名称', '')).strip()
            dept = clean_dept(u.get('主管部门', ''))
            level = str(u.get('学历层次', '')).strip()
            majors = []
            for m in u.get('专业列表', []):
                mn = str(m.get('专业名称', '')).strip()
                rq = str(m.get('选考科目要求', '') or '不提科目要求').strip() or '不提科目要求'
                ml = str(m.get('学历层次', '') or level).strip()
                majors.append([mn, req_idx[rq], ml])

                # —— 全局统计 ——
                ms = major_stat.setdefault(mn, {'recs': 0, 'provs': set(), 'unis': set(),
                                                'subj': Counter(), 'unlimited': 0})
                ms['recs'] += 1
                ms['provs'].add(prov)
                ms['unis'].add(code)
                mode, subs = parse_req(rq)
                if mode == 0:
                    ms['unlimited'] += 1
                for s in subs:
                    ms['subj'][s] += 1

            # —— 院校聚合 ——
            au = all_unis.setdefault(code, {'name': name, 'loc': prov, 'dept': dept,
                                            'provs': set(), 'recs': 0, 'level': level})
            au['provs'].add(prov)
            au['recs'] += len(majors)

            compact_unis.append([code, name, prov, dept, level, majors])

        n_recs = sum(len(u[5]) for u in compact_unis)
        n_names = len({m[0] for u in compact_unis for m in u[5]})
        total_recs += n_recs
        prov_index.append({'省份': prov, '大区': PROV2REGION[prov],
                           '院校数': len(compact_unis), '专业记录数': n_recs,
                           '去重专业数': n_names})

        with open(os.path.join(OUT, prov + '.json'), 'w', encoding='utf-8') as f:
            json.dump({'省份': prov, '要求字典': req_dict, '院校': compact_unis},
                      f, ensure_ascii=False, separators=(',', ':'))
        print(f'{prov}: {len(compact_unis)} 校 {n_recs} 条 → {prov}.json '
              f'({os.path.getsize(os.path.join(OUT, prov + ".json")) // 1024}KB)')

    # ---------------- provinces.json ----------------
    with open(os.path.join(OUT, 'provinces.json'), 'w', encoding='utf-8') as f:
        json.dump(prov_index, f, ensure_ascii=False, separators=(',', ':'))

    # ---------------- universities.json ----------------
    uni_rows = []
    for code, au in all_unis.items():
        uni_rows.append([code, au['name'], au['loc'], au['dept'],
                         len(au['provs']), au['recs'], sorted(au['provs'])])
    uni_rows.sort(key=lambda r: r[0])
    with open(os.path.join(OUT, 'universities.json'), 'w', encoding='utf-8') as f:
        json.dump(uni_rows, f, ensure_ascii=False, separators=(',', ':'))

    # ---------------- majors.json ----------------
    major_rows = []
    for name, ms in major_stat.items():
        n = ms['recs'] or 1
        row = [name, ms['recs'], len(ms['provs']), len(ms['unis']),
               round(ms['unlimited'] / n * 100, 1)]
        for k in ['物理', '化学', '生物', '政治', '历史', '地理']:
            row.append(round(ms['subj'].get(k, 0) / n * 100, 1))
        major_rows.append(row)
    major_rows.sort(key=lambda r: -r[1])
    with open(os.path.join(OUT, 'majors.json'), 'w', encoding='utf-8') as f:
        json.dump(major_rows, f, ensure_ascii=False, separators=(',', ':'))

    # ---------------- search-majors.json ----------------
    cats = list(ref_cat) if ref_cat else []
    other_idx = len(cats)
    m_n, m_p, m_s, m_a, m_c, m_r = [], [], [], [], [], []
    for row in major_rows:
        name = row[0]
        ref = ref_major.get(name)
        m_n.append(name)
        m_p.append(ref['p'] if ref else '')
        m_s.append(ref['s'] if ref else '')
        m_a.append(ref['a'] if ref else '')
        if ref is not None and ref['c'] < len(cats):
            m_c.append(ref['c'])
        else:
            if '其他' not in cats:
                cats.append('其他')
            m_c.append(cats.index('其他'))
        m_r.append(row[1])
    with open(os.path.join(OUT, 'search-majors.json'), 'w', encoding='utf-8') as f:
        json.dump({'n': m_n, 'p': m_p, 's': m_s, 'a': m_a, 'c': m_c, 'r': m_r,
                   'cat': cats}, f, ensure_ascii=False, separators=(',', ':'))

    # ---------------- search-universities.json ----------------
    prov_list = sorted({r[2] for r in uni_rows})
    u_n, u_p, u_s, u_a, u_v, u_r = [], [], [], [], [], []
    for r in uni_rows:
        ref = ref_uni.get(r[1])
        u_n.append(r[1])
        u_p.append(ref['p'] if ref else '')
        u_s.append(ref['s'] if ref else '')
        u_a.append(ref['a'] if ref else '')
        u_v.append(prov_list.index(r[2]))
        u_r.append(r[5])
    with open(os.path.join(OUT, 'search-universities.json'), 'w', encoding='utf-8') as f:
        json.dump({'n': u_n, 'p': u_p, 's': u_s, 'a': u_a, 'v': u_v, 'r': u_r,
                   'prov': prov_list}, f, ensure_ascii=False, separators=(',', ':'))

    # ---------------- summary.json(全国口径) ----------------
    summary = {
        '省份数': len(PROVINCES),
        '院校数': len(all_unis),
        '专业记录数': total_recs,
        '专业名称数': len(major_stat),
        '生成时间': generated,
        '数据来源': '各省教育考试院公开文件整理',
        '口径说明': '全国 31 省（自治区、直辖市）普通高校招生专业选考科目要求汇总，2027 年起适用',
    }
    with open(os.path.join(OUT, 'summary.json'), 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, separators=(',', ':'))

    print(f'\n=== 构建完成 ===')
    print(f"省份 {summary['省份数']} | 院校 {summary['院校数']} | 记录 {summary['专业记录数']} | 专业 {summary['专业名称数']}")
    print(f'输出目录: {OUT}')
    print(f'数据文件总数: {len(os.listdir(OUT))}')

if __name__ == '__main__':
    main()
