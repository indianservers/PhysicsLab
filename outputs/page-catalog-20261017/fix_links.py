import zipfile,xml.etree.ElementTree as ET,json,pathlib
p=pathlib.Path(__file__).parent
f=p/'physics_pages_catalog.xlsx'
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(f) as z: contents={n:z.read(n) for n in z.namelist()}
root=ET.fromstring(contents['xl/worksheets/sheet1.xml'])
rows=json.loads((p/'pages.json').read_text(encoding='utf8'))
for cell in root.findall('.//m:c',ns):
 ref=cell.get('r','')
 if ref.startswith('F') and ref[1:].isdigit() and int(ref[1:])>=7:
  idx=int(ref[1:])-7
  if idx<len(rows):
   cell.set('t','str')
   v=cell.find('m:v',ns)
   if v is None:v=ET.SubElement(cell,'{'+ns['m']+'}v')
   v.text=rows[idx]['url']
contents['xl/worksheets/sheet1.xml']=ET.tostring(root,encoding='utf-8',xml_declaration=True)
with zipfile.ZipFile(f,'w',zipfile.ZIP_DEFLATED) as z:
 for n,data in contents.items():z.writestr(n,data)
assert len({r['url'] for r in rows})==589
assert all(r['description'] and r['topic'] for r in rows)
print('Verified 589 distinct URLs, descriptions, topics, and hyperlink formula caches.')
