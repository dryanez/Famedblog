from pathlib import Path
import json,re,hashlib
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor,white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from arabic_reshaper import reshape
from bidi.algorithm import get_display
from translations import *
from chapters import ES,AR
ROOT=Path(__file__).resolve().parents[2]
FONT='/System/Library/Fonts/Supplemental/Arial Unicode.ttf'
pdfmetrics.registerFont(TTFont('Guide',FONT))
W,H=595.276,841.89
COL=HexColor('#1744bf');INK=HexColor('#17233b')
reports=[]
def visual(s,ar):
 if not ar or not re.search(r'[\u0600-\u06ff]',s):return s
 s=re.sub(r'"[^"]+"',lambda m:'\u202a'+m.group(0)+'\u202c',s)
 return get_display(reshape(s),base_dir='R')

def lines(text,font,width,ar):
 out=[]
 for para in text.split('\n'):
  if not para.strip():out.append('');continue
  line=''
  for word in para.split():
   nxt=(line+' '+word).strip()
   if pdfmetrics.stringWidth(visual(nxt,ar),'Guide',font)>width and line:out.append(line);line=word
   else:line=nxt
  if line:out.append(line)
 return out

def draw(c,text,x,y,width,size=11.3,ar=False,leading=None):
 leading=leading or size*1.55
 for line in lines(text,size,width,ar):
  if not line:y-=leading*.48;continue
  c.setFont('Guide',size);c.setFillColor(INK)
  if ar:c.drawRightString(x+width,y,visual(line,True))
  else:c.drawString(x,y,line)
  for url in re.findall(r'https://[^\s]+',line):
   c.linkURL(url,(x,y-3,x+width,y+size),relative=0,thickness=0)
  y-=leading
 return y

def header(c,title,num,ar):
 c.setFillColor(COL);c.rect(0,H-13,W,13,fill=1,stroke=0)
 c.drawImage(str(ROOT/'public/logo.png'),40,H-72,width=40,height=40,mask='auto',preserveAspectRatio=True)
 c.setFillColor(COL);c.setFont('Guide',10);c.drawString(94,H-51,'FaMED Prep  /  '+(visual('العربية',True) if ar else 'Español'))
 y=draw(c,title,42,H-112,W-84,21,ar,28)
 c.setStrokeColor(HexColor('#dce4f5'));c.line(42,56,W-42,56)
 c.setFont('Guide',9);c.setFillColor(HexColor('#64748b'));c.drawString(42,37,'FaMED Prep  ·  21.10.2026');c.drawRightString(W-42,37,str(num)+' / 30')
 return y-15

def build(locale,data,weeks):
 ar=locale=='ar';out=ROOT/'content/guides'/f'famed-study-guide-{locale}.pdf'
 c=canvas.Canvas(str(out),pagesize=(W,H),pageCompression=1);c.setTitle(data['cover'].replace('\n',' '));c.setAuthor('FaMED Prep');c.setSubject('Complete translated eight-week preparation guide; German practice preserved')
 page_count=0;body_meta=[]
 def page(title,text,size=11.3):
  nonlocal page_count
  page_count+=1;y=header(c,title,page_count,ar);bodylines=lines(text,size,W-84,ar)
  needed=sum(size*1.55*(.48 if not s else 1) for s in bodylines)
  while needed>y-72:
   size-=.2
   if size<9.5:raise ValueError(f'Page overflow {locale}/{page_count}: {title}')
   bodylines=lines(text,size,W-84,ar);needed=sum(size*1.55*(.48 if not s else 1) for s in bodylines)
  bottom=draw(c,text,42,y,W-84,size,ar);assert bottom>65,(locale,page_count,bottom)
  body_meta.append({'page':page_count,'title':title,'minimumFont':round(size,1),'bottom':round(bottom,1)});c.showPage()
 # Branded cover: designed separately from the unchanged original.
 page_count=1;c.setFillColor(HexColor('#f4f7ff'));c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(COL);c.rect(0,H-220,W,220,fill=1,stroke=0)
 c.drawImage(str(ROOT/'public/logo.png'),W/2-48,H-150,width=96,height=96,mask='auto',preserveAspectRatio=True)
 draw(c,data['cover'],48,H-300,W-96,29,ar,42)
 draw(c,data['sub'],48,H-440,W-96,18,ar,28)
 note='Calendario completo · Casos · Expresiones alemanas · Listas de comprobación' if not ar else 'جدول كامل · حالات · عبارات ألمانية · قوائم تحقق'
 draw(c,note,48,250,W-96,13,ar)
 draw(c,'Edición española · 30 páginas · 21 de octubre de 2026' if not ar else 'نسخة عربية · 30 صفحة · 21 أكتوبر 2026',48,150,W-96,11,ar)
 c.setFillColor(HexColor('#ffcf4a'));c.rect(0,0,W,18,fill=1,stroke=0);c.showPage()
 for key in ['intro','exam','format']:page(*data[key])
 # Page5 preserves both complete case lists, arranged in two columns.
 page_count+=1;y=header(c,data['cases'],page_count,ar);y=draw(c,data['cases_note'],42,y,W-84,10.5,ar)-16
 col=(W-98)/2
 for x,title,items in [(42,data['an'],CASES_AN),(56+col,data['auf'],CASES_AUF)]:
  cy=draw(c,title,x,y,col,13,ar)-10
  for n,item in enumerate(items,1):cy=draw(c,f'{n}. {item}',x,cy,col,10.2,False,15.7)-3
  assert cy>70,(locale,5,cy)
 c.showPage()
 page(data['br'],data['br_note']+'\n\n'+'\n'.join(f'{i}. {s}' for i,s in enumerate(CASES_BR,1)),11.2)
 page(data['aa'],data['aa_note']+'\n\n'+'\n'.join(f'{i}. {s}' for i,s in enumerate(CASES_AA,1)),10.5)
 page(*data['framework'],size=10.4)
 days=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'] if not ar else ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد']
 sessions=['Mañana','Tarde','Noche'] if not ar else ['صباحاً','بعد الظهر','مساءً']
 for week,(topic,rows) in enumerate(weeks,1):
  groups=[(0,rows[:5]),(5,rows[5:])] if week<8 else [(0,rows)]
  for start,group in groups:
   title=(f'Semana {week}: ' if not ar else f'الأسبوع {week}: ')+topic
   text=''
   for day,row in enumerate(group,start):
    name=days[day] if day<len(days) else row[0]
    if week==8 and day==4:name='Día del examen' if not ar else 'يوم الامتحان'
    text+=name+' — '+row[0]+'\n'
    for label,activity in zip(sessions,row[1:]):text+=label+': '+activity+'\n'
    text+='\n'
   page(title,text,11.0)
 for key in ['examday','check','mistakes1','mistakes2','resources','products','closing']:page(*data[key])
 assert page_count==30,page_count;c.save()
 reports.append({'locale':locale,'pages':page_count,'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'checkedPageLayout':body_meta,'dailyRows':sum(len(x[1]) for x in weeks),'caseLists':{'anamnese':len(CASES_AN),'aufklaerung':len(CASES_AUF),'arztArzt':len(CASES_AA),'writingTopics':len(CASES_BR)}})
for locale,data,weeks in [('es',ES,ES_WEEKS),('ar',AR,AR_WEEKS)]:build(locale,data,weeks)
(ROOT/'content/guides/translation-manifest.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2))
print(json.dumps([{k:v for k,v in r.items() if k!='checkedPageLayout'} for r in reports],ensure_ascii=False))
