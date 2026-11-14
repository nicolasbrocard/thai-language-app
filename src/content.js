/* Phûut Thai — course content.
   Sentences are written as space-separated Thai words in the MALE form (ผม / ครับ).
   The app swaps in ฉัน / ค่ะ / คะ for female speakers and derives the romanization from LEX,
   so every word used below must have a LEX line:  thai|romanization|gloss|emoji(optional)
   Tones in romanization: a = mid, à = low, â = falling, á = high, ǎ = rising. */

const LEX = `
สวัสดี|sà-wàt-dii|hello|🙏
ครับ|khráp|polite word (man)
ค่ะ|khâ|polite word (woman)
คะ|khá|polite word (woman, question)
ขอบคุณ|khàwp-khun|thank you
ขอโทษ|khǎw-thôot|sorry, excuse me
ไม่เป็นไร|mâi-pen-rai|no problem
ใช่|châi|yes, right|✅
ไม่|mâi|not
มาก|mâak|very, a lot
สบายดี|sà-baai-dii|fine, well
สบาย|sà-baai|well, comfortable
ไหม|mǎi|(makes a yes/no question)
ผม|phǒm|I (man)
ฉัน|chǎn|I (woman)
คุณ|khun|you
แล้ว|láew|already; and then
ล่ะ|lâ|what about…?
ชื่อ|chûe|name
อะไร|à-rai|what|❓
ทอม|thawm|Tom
ยินดีที่ได้รู้จัก|yin-dii-thîi-dâi-rúu-jàk|nice to meet you|🤝
มา|maa|come
จาก|jàak|from
ไหน|nǎi|where, which
ฝรั่งเศส|fà-ràng-sèet|France|🇫🇷
เอา|ao|want, take
น้ำ|nám|water|💧
กาแฟ|kaa-fae|coffee|☕
เบียร์|bia|beer|🍺
อัน|an|piece, one (thing)
นี้|níi|this
มี|mii|have, there is
น้ำแข็ง|nám-khǎeng|ice|🧊
ห้องน้ำ|hâwng-nám|toilet|🚻
ได้|dâi|can, OK|👌
ชอบ|châwp|like|👍
ดี|dii|good
อร่อย|à-ràwy|delicious|😋
ร้อน|ráwn|hot|🥵
เย็น|yen|cold, cool|❄️
หนึ่ง|nùeng|one|1️⃣
สอง|sǎwng|two|2️⃣
สาม|sǎam|three|3️⃣
สี่|sìi|four|4️⃣
ห้า|hâa|five|5️⃣
หก|hòk|six|6️⃣
เจ็ด|jèt|seven|7️⃣
แปด|pàet|eight|8️⃣
เก้า|kâo|nine|9️⃣
สิบ|sìp|ten|🔟
ยี่สิบ|yîi-sìp|twenty
ร้อย|ráwy|hundred|💯
พัน|phan|thousand
แก้ว|kâew|glass, cup|🥛
เท่าไหร่|thâo-rài|how much
บาท|bàat|baht|💵
แพง|phaeng|expensive|💸
ลด|lót|reduce, discount
ถูก|thùuk|cheap
ข้าว|khâao|rice|🍚
ไก่|kài|chicken|🐔
หมู|mǔu|pork|🐷
ข้าวผัด|khâao-phàt|fried rice|🍛
ผัดไทย|phàt-thai|pad thai|🍜
ขอ|khǎw|may I have
เผ็ด|phèt|spicy|🌶️
นิดหน่อย|nít-nàwy|a little|🤏
กิน|kin|eat|🍽️
ใส่|sài|put in, add
น้ำตาล|nám-taan|sugar|🍬
ผัก|phàk|vegetables|🥬
หิว|hǐu|hungry|🤤
อิ่ม|ìm|full (of food)
อยาก|yàak|want to
เช็คบิล|chék-bin|the bill|🧾
ดื่ม|dùem|drink|🥤
อีก|ìik|more, another
ที่ไหน|thîi-nǎi|where
อยู่|yùu|be at, live
โรงแรม|roong-raem|hotel|🏨
ร้านอาหาร|ráan-aa-hǎan|restaurant|🍴
ที่นี่|thîi-nîi|here|📍
ที่นั่น|thîi-nân|there|👉
ที่|thîi|at
ไป|pai|go
ตรงไป|trong-pai|go straight|⬆️
เลี้ยว|líao|turn
ซ้าย|sáai|left|⬅️
ขวา|khwǎa|right|➡️
จอด|jàwt|stop, park|🛑
ใกล้|klâi|near
ไกล|klai|far
รถ|rót|car|🚗
แท็กซี่|tháek-sîi|taxi|🚕
จักรยาน|jàk-krà-yaan|bicycle|🚲
สนามบิน|sà-nǎam-bin|airport|✈️
กี่|kìi|how many
ถึง|thǔeng|arrive
ช้า|cháa|slow|🐢
หน่อย|nàwy|a bit (softens a request)
เข้าใจ|khâo-jai|understand|💡
พูด|phûut|speak|🗣️
ภาษาไทย|phaa-sǎa-thai|Thai (language)|🇹🇭
ภาษาอังกฤษ|phaa-sǎa-ang-krìt|English (language)|🇬🇧
อีกที|ìik-thii|again, once more|🔁
รู้|rúu|know
นี่|nîi|this (thing)
เรียก|rîak|call
ว่า|wâa|that, saying
แปล|plae|translate, mean
ช่วย|chûai|help|🆘
ด้วย|dûai|also; please
เจ็บ|jèp|hurt|🤕
ยา|yaa|medicine|💊
โรงพยาบาล|roong-phá-yaa-baan|hospital|🏥
หมอ|mǎw|doctor|🩺
ระวัง|rá-wang|careful!|⚠️
เหนื่อย|nùeai|tired|😮‍💨
วันนี้|wan-níi|today|📅
พรุ่งนี้|phrûng-níi|tomorrow|⏭️
เมื่อวาน|mûea-waan|yesterday|⏮️
ตอนนี้|tawn-níi|now
จะ|jà|will
เมื่อไหร่|mûea-rài|when
โมง|moong|o'clock|🕙
เปิด|pòet|open|🔓
ปิด|pìt|close, closed|🔒
ตอนเช้า|tawn-cháo|in the morning|🌅
ตอนเย็น|tawn-yen|in the evening|🌇
รอ|raw|wait|✋
แป๊บนึง|páep-nueng|a moment
ยัง|yang|not yet, still
เสร็จ|sèt|finished
หรือ|rǔe|or
เร็ว|reo|fast|⚡
นาที|naa-thii|minute|⏱️
เพื่อน|phûean|friend|🧑‍🤝‍🧑
แฟน|faen|partner, boyfriend/girlfriend|❤️
ลูก|lûuk|child|🧒
พ่อ|phâw|father|👨
แม่|mâe|mother|👩
คน|khon|person, people|🧍
สวย|sǔai|beautiful|🌺
ใจดี|jai-dii|kind|😊
สนุก|sà-nùk|fun|🎉
ใหญ่|yài|big|🐘
เล็ก|lék|small|🐜
เก่ง|kèng|skilled, good at|🏅
ทำงาน|tham-ngaan|work|💼
บ้าน|bâan|home, house|🏠
กลับ|klàp|return, go back
เมืองไทย|mueang-thai|Thailand|🇹🇭
ปี|pii|year
ซื้อ|súe|buy|🛍️
ตลาด|tà-làat|market|🧺
จ่าย|jàai|pay
บัตร|bàt|card|💳
เงินสด|ngoen-sòt|cash|💵
ถุง|thǔng|bag
สี|sǐi|colour
แดง|daeng|red|🔴
ดำ|dam|black|⚫
ขาว|khǎao|white|⚪
กว่า|kwàa|more than, -er
ลอง|lawng|try
อื่น|ùen|other
ห้อง|hâwng|room|🚪
ว่าง|wâang|free, vacant
คืน|khuen|night|🌙
ละ|lá|per
จอง|jawng|book, reserve
แอร์|ae|air-con|🌬️
กุญแจ|kun-jae|key|🔑
คิด|khít|think|🤔
จริง|jing|true, real
แน่นอน|nâe-nawn|of course
อาจจะ|àat-jà|maybe
รัก|rák|love|❤️
มีความสุข|mii-khwaam-sùk|happy|😄
เสียใจ|sǐa-jai|sad, sorry|😢
ทำไม|tham-mai|why
เพราะ|phráw|because
แต่|tàe|but
กับ|kàp|with, and
ด้วยกัน|dûai-kan|together
ไทย|thai|Thai
ก่อน|kàwn|first, before
นะ|ná|(softener, "okay?")
เจอ|joe|meet
กัน|kan|each other
โชคดี|chôok-dii|good luck|🍀
ยินดี|yin-dii|glad; you're welcome
เช่นกัน|chên-kan|likewise
เดินทาง|doen-thaang|travel
ปลอดภัย|plàwt-phai|safe
ฝันดี|fǎn-dii|sweet dreams|😴
`;

/* item = [thai, english, emoji?]   mix = sentences built only from words already met.
   dialogue line = [speaker, thai, english]; the learner plays speaker "B". */
const COURSE = [
{ id:'u1', title:'First words', sub:'Greet, thank, introduce yourself', lessons:[
  { title:'Hello and thank you',
    tip:['The polite word', 'Thai adds a small polite word at the end of almost every sentence. Men say <b>khráp</b>, women say <b>khâ</b>. It carries no meaning of its own, it just makes you sound friendly. When in doubt, add it.'],
    items:[['สวัสดี ครับ','Hello','🙏'],['ขอบคุณ ครับ','Thank you','🙇'],['ขอโทษ ครับ','Sorry / Excuse me'],['ไม่เป็นไร','No problem / Never mind'],['ใช่','Yes, that\'s right'],['ไม่ ใช่','No, that\'s not right','❌'],['ขอบคุณ มาก ครับ','Thank you very much']],
    mix:[['ใช่ ครับ','Yes (polite)'],['ไม่เป็นไร ครับ','No problem (polite)'],['ไม่ ใช่ ครับ','No, that\'s not right (polite)']] },
  { title:'How are you?',
    tip:['Questions with mǎi', 'Put <b>mǎi</b> at the end of a statement and it becomes a yes/no question. <b>sà-baai-dii</b> = (you are) well. <b>sà-baai-dii mǎi</b> = are you well? To say no, put <b>mâi</b> (not) in front: <b>mâi sà-baai</b>.'],
    items:[['สบายดี ไหม ครับ','How are you?'],['สบายดี ครับ','I\'m fine'],['ผม','I, me'],['คุณ','you','🫵'],['แล้ว คุณ ล่ะ ครับ','And you?'],['ไม่ สบาย','not well, sick','🤒']],
    mix:[['คุณ สบายดี ไหม ครับ','Are you well?'],['ผม สบายดี ครับ ขอบคุณ ครับ','I\'m fine, thank you'],['ผม ไม่ สบาย','I\'m not well']] },
  { title:'Names',
    tip:['Verbs never change', 'Thai has no am / is / are and no verb endings. <b>phǒm chûe Tom</b> is literally "I name Tom". One form of each word, forever. You build sentences like Lego.'],
    items:[['ชื่อ','name, to be called'],['อะไร','what'],['คุณ ชื่อ อะไร ครับ','What\'s your name?'],['ผม ชื่อ ทอม ครับ','My name is Tom'],['ยินดีที่ได้รู้จัก ครับ','Nice to meet you'],['คุณ มา จาก ไหน ครับ','Where are you from?'],['ผม มา จาก ฝรั่งเศส','I\'m from France']],
    mix:[['คุณ ชื่อ ทอม ใช่ ไหม ครับ','Your name is Tom, right?'],['ใช่ ครับ ผม ชื่อ ทอม','Yes, my name is Tom'],['คุณ มา จาก ฝรั่งเศส ใช่ ไหม ครับ','You\'re from France, right?']],
    dialogue:{ title:'Meeting someone', lines:[['A','สวัสดี ครับ คุณ ชื่อ อะไร ครับ','Hello, what\'s your name?'],['B','สวัสดี ครับ ผม ชื่อ ทอม ครับ','Hello, my name is Tom.'],['A','คุณ มา จาก ไหน ครับ','Where are you from?'],['B','ผม มา จาก ฝรั่งเศส ครับ','I\'m from France.'],['A','ยินดีที่ได้รู้จัก ครับ','Nice to meet you.'],['B','ยินดีที่ได้รู้จัก ครับ','Nice to meet you.']] } },
]},
{ id:'u2', title:'Want, have, like', sub:'The three verbs that get you fed', lessons:[
  { title:'I want, I don\'t want',
    tip:['mâi = not', 'Put <b>mâi</b> (falling tone) in front of any verb to negate it. <b>ao</b> = want. <b>mâi ao</b> = don\'t want. That one pattern works for every verb in the language.'],
    items:[['เอา','want, take','🤲'],['ไม่ เอา ครับ','No thanks, I don\'t want it'],['น้ำ','water'],['กาแฟ','coffee'],['เบียร์','beer'],['เอา น้ำ ครับ','I\'ll have water'],['อัน นี้','this one','👇']],
    mix:[['เอา กาแฟ ครับ','I\'ll have coffee'],['เอา อัน นี้ ครับ','I\'ll take this one'],['ไม่ เอา เบียร์ ครับ','I don\'t want beer'],['เอา เบียร์ ไหม ครับ','Do you want a beer?']] },
  { title:'Do you have…?',
    tip:['Answer with the verb', 'Thai has no single word for yes or no. You answer with the verb from the question. <b>mii mǎi?</b> (do you have?) → <b>mii</b> (have) or <b>mâi mii</b> (not have).'],
    items:[['มี','have, there is'],['ไม่ มี','don\'t have, there isn\'t'],['มี น้ำ ไหม ครับ','Do you have water?'],['น้ำแข็ง','ice'],['ห้องน้ำ','toilet'],['มี ห้องน้ำ ไหม ครับ','Is there a toilet?'],['ได้','can, OK'],['ไม่ ได้','cannot, not OK','🚫']],
    mix:[['มี กาแฟ ไหม ครับ','Do you have coffee?'],['ไม่ มี น้ำแข็ง ครับ','There\'s no ice'],['มี เบียร์ ครับ','We have beer'],['ได้ ไหม ครับ','Is that OK?'],['ได้ ครับ','Yes, OK']] },
  { title:'Like it, love it',
    tip:['No "is" for descriptions', 'Describing words work like verbs. <b>à-ràwy</b> alone means "it is delicious". Add <b>mâak</b> after it for "very". Descriptions follow the thing: <b>kaa-fae yen</b> = coffee cold = iced coffee.'],
    items:[['ชอบ','like'],['ดี','good','👍'],['อร่อย','delicious'],['อร่อย มาก','very delicious'],['ผม ชอบ กาแฟ','I like coffee'],['ร้อน','hot'],['เย็น','cold, cool'],['กาแฟ เย็น','iced coffee','🧋']],
    mix:[['ผม ไม่ ชอบ เบียร์','I don\'t like beer'],['คุณ ชอบ กาแฟ ไหม ครับ','Do you like coffee?'],['ดี มาก ครับ','Very good'],['เอา กาแฟ เย็น ครับ','I\'ll have an iced coffee'],['น้ำ เย็น','cold water'],['ร้อน มาก','very hot']],
    dialogue:{ title:'At the coffee stand', lines:[['A','สวัสดี ครับ เอา อะไร ครับ','Hello, what would you like?'],['B','มี กาแฟ เย็น ไหม ครับ','Do you have iced coffee?'],['A','มี ครับ','We do.'],['B','เอา กาแฟ เย็น ครับ','I\'ll have an iced coffee.'],['A','เอา น้ำ ไหม ครับ','Do you want water?'],['B','ไม่ เอา ครับ ขอบคุณ ครับ','No thanks.']] } },
]},
{ id:'u3', title:'Numbers and money', sub:'Count, ask prices, bargain', lessons:[
  { title:'One to five',
    tip:['Thing first, then how many', 'Thai counts like "coffee two cups": the thing, the number, then a counting word. <b>kâew</b> counts glasses and cups. <b>an</b> counts almost any small object.'],
    items:[['หนึ่ง','one'],['สอง','two'],['สาม','three'],['สี่','four'],['ห้า','five'],['เอา สอง อัน ครับ','I\'ll take two'],['แก้ว','glass, cup'],['เอา กาแฟ สอง แก้ว ครับ','Two coffees, please']],
    mix:[['เอา สาม อัน ครับ','I\'ll take three'],['เอา น้ำ หนึ่ง แก้ว ครับ','One glass of water, please'],['เอา เบียร์ สี่ แก้ว ครับ','Four glasses of beer, please'],['เอา ห้า อัน ครับ','I\'ll take five']] },
  { title:'Six to a hundred',
    tip:['Numbers are logical', 'Thirty is "three ten": <b>sǎam sìp</b>. Two hundred is "two hundred": <b>sǎwng ráwy</b>. Twelve is "ten two": <b>sìp sǎwng</b>. Only twenty is irregular: <b>yîi-sìp</b>.'],
    items:[['หก','six'],['เจ็ด','seven'],['แปด','eight'],['เก้า','nine'],['สิบ','ten'],['ยี่สิบ','twenty'],['ร้อย','hundred']],
    mix:[['สาม สิบ','thirty'],['ห้า สิบ','fifty'],['สอง ร้อย','two hundred'],['สิบ สอง','twelve'],['ยี่สิบ ห้า','twenty-five'],['หนึ่ง ร้อย ห้า สิบ','one hundred and fifty']] },
  { title:'How much is it?',
    tip:['Bargaining politely', 'At markets a smile and <b>lót dâi mǎi khráp</b> (can you reduce?) is expected. <b>dâi mǎi</b> after anything means "can I / could you?".'],
    items:[['เท่าไหร่','how much'],['อัน นี้ เท่าไหร่ ครับ','How much is this?'],['บาท','baht'],['ห้า สิบ บาท','fifty baht'],['แพง','expensive'],['ถูก','cheap','🪙'],['ลด ได้ ไหม ครับ','Can you lower the price?'],['พัน','thousand']],
    mix:[['สอง ร้อย บาท ครับ','Two hundred baht'],['ไม่ แพง','not expensive'],['กาแฟ เท่าไหร่ ครับ','How much is the coffee?'],['ร้อย ยี่สิบ บาท','a hundred and twenty baht'],['หนึ่ง พัน บาท','one thousand baht'],['ถูก มาก','very cheap'],['แพง มาก','very expensive']],
    dialogue:{ title:'At the market', lines:[['B','อัน นี้ เท่าไหร่ ครับ','How much is this?'],['A','สอง ร้อย บาท ครับ','Two hundred baht.'],['B','แพง มาก ลด ได้ ไหม ครับ','Very expensive. Can you lower it?'],['A','ร้อย ห้า สิบ บาท ครับ','A hundred and fifty baht.'],['B','ได้ ครับ เอา สอง อัน ครับ','OK, I\'ll take two.'],['A','ขอบคุณ ครับ','Thank you.']] } },
]},
{ id:'u4', title:'Eating out', sub:'Order, adjust the spice, pay', lessons:[
  { title:'Ordering food',
    tip:['khǎw = may I have', '<b>khǎw</b> + thing is the polite way to order. Ingredients follow the dish: <b>khâao-phàt kài</b> = fried rice (with) chicken.'],
    items:[['ข้าว','rice'],['ไก่','chicken'],['หมู','pork'],['ข้าวผัด','fried rice'],['ผัดไทย','pad thai'],['ขอ','may I have','🙋'],['ขอ ข้าวผัด ไก่ ครับ','Chicken fried rice, please']],
    mix:[['ขอ ผัดไทย ครับ','Pad thai, please'],['ขอ ข้าวผัด หมู ครับ','Pork fried rice, please'],['ขอ น้ำ สอง แก้ว ครับ','Two glasses of water, please'],['มี ผัดไทย ไหม ครับ','Do you have pad thai?'],['ผม ชอบ ผัดไทย มาก','I really like pad thai']] },
  { title:'Not too spicy',
    tip:['dâi after a verb = can', '<b>kin phèt dâi</b> = eat spicy can = "I can eat spicy food". <b>kin phèt mâi dâi</b> = "I can\'t". The ability word comes last.'],
    items:[['เผ็ด','spicy'],['ไม่ เผ็ด','not spicy'],['เผ็ด นิดหน่อย','a little spicy'],['กิน','eat'],['ผม ไม่ กิน เผ็ด','I don\'t eat spicy food'],['ใส่','put in, add','🥄'],['น้ำตาล','sugar'],['ไม่ ใส่ น้ำตาล','no sugar'],['ผัก','vegetables']],
    mix:[['เผ็ด ไหม ครับ','Is it spicy?'],['เผ็ด มาก','very spicy'],['ไม่ ใส่ น้ำแข็ง ครับ','No ice, please'],['ผม ไม่ กิน หมู','I don\'t eat pork'],['ผม กิน เผ็ด ได้','I can eat spicy food'],['ขอ ไม่ เผ็ด ครับ','Not spicy, please'],['ผม ชอบ ผัก','I like vegetables']] },
  { title:'Hungry, full, the bill',
    tip:['láew = already', '<b>láew</b> after a verb marks something as done or now true. <b>ìm láew</b> = full already = "I\'m full". <b>kin láew</b> = "I\'ve eaten". <b>yàak</b> + verb = want to do.'],
    items:[['หิว','hungry'],['อิ่ม แล้ว','I\'m full','😌'],['อยาก','want to (do)'],['ผม อยาก กิน ผัดไทย','I want to eat pad thai'],['ดื่ม','drink'],['เช็คบิล ครับ','The bill, please'],['ขอ น้ำ อีก หนึ่ง แก้ว ครับ','One more glass of water, please']],
    mix:[['หิว ไหม ครับ','Are you hungry?'],['ผม หิว มาก','I\'m very hungry'],['คุณ อยาก กิน อะไร ครับ','What do you want to eat?'],['ผม อยาก ดื่ม กาแฟ','I want to drink coffee'],['กิน ข้าว แล้ว','I\'ve already eaten'],['ขอ ข้าว อีก ครับ','More rice, please']],
    dialogue:{ title:'At the restaurant', lines:[['A','คุณ อยาก กิน อะไร ครับ','What would you like to eat?'],['B','ขอ ข้าวผัด ไก่ ครับ ไม่ เผ็ด','Chicken fried rice, please. Not spicy.'],['A','ดื่ม อะไร ครับ','What will you drink?'],['B','ขอ น้ำ หนึ่ง แก้ว ครับ ไม่ ใส่ น้ำแข็ง','A glass of water, please. No ice.'],['A','อร่อย ไหม ครับ','Is it good?'],['B','อร่อย มาก ครับ เช็คบิล ครับ','Delicious. The bill, please.']] } },
]},
{ id:'u5', title:'Getting around', sub:'Where, directions, transport', lessons:[
  { title:'Where is it?',
    tip:['The question word sits where the answer goes', 'English moves "where" to the front. Thai leaves it in place: <b>hâwng-nám yùu thîi-nǎi</b> = toilet is-at where? Answer by swapping one word: <b>hâwng-nám yùu thîi-nân</b> = toilet is-at there.'],
    items:[['ที่ไหน','where','🗺️'],['อยู่','to be at, to live'],['ห้องน้ำ อยู่ ที่ไหน ครับ','Where is the toilet?'],['โรงแรม','hotel'],['ร้านอาหาร','restaurant'],['ที่นี่','here'],['ที่นั่น','there'],['ผม อยู่ ที่ โรงแรม','I\'m at the hotel']],
    mix:[['โรงแรม อยู่ ที่ไหน ครับ','Where is the hotel?'],['ร้านอาหาร อยู่ ที่นั่น','The restaurant is there'],['คุณ อยู่ ที่ไหน ครับ','Where are you?'],['อยู่ ที่นี่','It\'s here'],['ห้องน้ำ อยู่ ที่นั่น ครับ','The toilet is over there']] },
  { title:'Go, left, right',
    tip:['Your first tone pair', '<b>klâi</b> (falling, like a firm "no!") means near. <b>klai</b> (flat) means far. Same sounds, opposite meanings. This is why the app makes you listen before you read.'],
    items:[['ไป','go','🚶'],['ไป ไหน ครับ','Where are you going?'],['ตรงไป','go straight'],['เลี้ยว ซ้าย','turn left','⬅️'],['เลี้ยว ขวา','turn right','➡️'],['จอด ที่นี่ ครับ','Stop here, please'],['ใกล้','near','📍'],['ไกล','far','🔭']],
    mix:[['ไกล ไหม ครับ','Is it far?'],['ไม่ ไกล','not far'],['ใกล้ มาก','very near'],['ผม ไป โรงแรม','I\'m going to the hotel'],['เลี้ยว ซ้าย ที่นี่ ครับ','Turn left here'],['ผม อยาก ไป ห้องน้ำ','I want to go to the toilet']] },
  { title:'Taxi, bike, airport',
    tip:['Doubling softens', 'Saying a describing word twice makes it gentler: <b>cháa cháa</b> = nice and slow. Add <b>nàwy</b> (a bit) to turn any request into a polite one.'],
    items:[['รถ','car, vehicle'],['แท็กซี่','taxi'],['จักรยาน','bicycle'],['สนามบิน','airport'],['ไป สนามบิน เท่าไหร่ ครับ','How much to the airport?'],['กี่ บาท ครับ','How many baht?'],['ถึง แล้ว','We\'ve arrived','🏁'],['ช้า ช้า หน่อย ครับ','Slowly, please']],
    mix:[['มี แท็กซี่ ไหม ครับ','Is there a taxi?'],['ผม ชอบ จักรยาน','I like bicycles'],['ไป โรงแรม กี่ บาท ครับ','How many baht to the hotel?'],['รถ อยู่ ที่ไหน ครับ','Where is the car?'],['สนามบิน ไกล ไหม ครับ','Is the airport far?']],
    dialogue:{ title:'Taking a taxi', lines:[['A','ไป ไหน ครับ','Where are you going?'],['B','ไป สนามบิน ครับ เท่าไหร่ ครับ','To the airport. How much?'],['A','สาม ร้อย บาท ครับ','Three hundred baht.'],['B','ได้ ครับ ไกล ไหม ครับ','OK. Is it far?'],['A','ไม่ ไกล ครับ','Not far.'],['A','ถึง แล้ว ครับ','We\'ve arrived.'],['B','จอด ที่นี่ ครับ ขอบคุณ ครับ','Stop here, please. Thank you.']] } },
]},
{ id:'u6', title:'Understanding and help', sub:'Keep a conversation alive', lessons:[
  { title:'I don\'t understand',
    tip:['The survival sentences', 'These four phrases let you keep talking when you get lost. Learn them until they come out without thinking. Remember: <b>dâi</b> at the end = can, <b>dâi mǎi</b> = could you?'],
    items:[['เข้าใจ','understand'],['ไม่ เข้าใจ ครับ','I don\'t understand'],['พูด','speak'],['ภาษาไทย','Thai (language)'],['ภาษาอังกฤษ','English (language)'],['ผม พูด ภาษาไทย ได้ นิดหน่อย','I can speak a little Thai'],['พูด ช้า ช้า หน่อย ได้ ไหม ครับ','Could you speak slowly?'],['พูด อีกที ได้ ไหม ครับ','Can you say that again?']],
    mix:[['คุณ พูด ภาษาอังกฤษ ได้ ไหม ครับ','Can you speak English?'],['เข้าใจ ไหม ครับ','Do you understand?'],['เข้าใจ แล้ว ครับ','I understand now'],['ผม พูด ภาษาไทย ไม่ ได้','I can\'t speak Thai'],['ผม ไม่ เข้าใจ ภาษาไทย','I don\'t understand Thai']] },
  { title:'What is this called?',
    tip:['Turn every Thai person into a teacher', '<b>an níi rîak wâa à-rai</b> = this one is called what? Point at anything and ask. It is the single most useful sentence for learning on the street.'],
    items:[['รู้','know','🧠'],['ไม่ รู้','I don\'t know','🤷'],['นี่ อะไร ครับ','What is this?'],['อัน นี้ เรียก ว่า อะไร ครับ','What is this called?'],['แปล ว่า อะไร ครับ','What does it mean?'],['ช่วย ด้วย','Help!'],['ช่วย ผม หน่อย ได้ ไหม ครับ','Could you help me?']],
    mix:[['คุณ รู้ ไหม ครับ','Do you know?'],['ผม ไม่ รู้ ครับ','I don\'t know'],['ผม รู้ แล้ว','I know now'],['ภาษาไทย เรียก ว่า อะไร ครับ','What is it called in Thai?']] },
  { title:'When something is wrong',
    tip:['Short is fine', 'In an emergency, single words work. <b>jèp thîi-nîi</b> (hurts here) while pointing says everything a doctor needs.'],
    items:[['เจ็บ','hurt, pain'],['เจ็บ ที่นี่','It hurts here'],['ยา','medicine'],['โรงพยาบาล','hospital'],['หมอ','doctor'],['ผม อยาก ไป โรงพยาบาล','I want to go to the hospital'],['ระวัง','Careful!'],['เหนื่อย','tired']],
    mix:[['มี ยา ไหม ครับ','Do you have medicine?'],['โรงพยาบาล อยู่ ที่ไหน ครับ','Where is the hospital?'],['เจ็บ มาก','It hurts a lot'],['ผม เหนื่อย มาก','I\'m very tired'],['เจ็บ ไหม ครับ','Does it hurt?'],['โรงพยาบาล ไกล ไหม ครับ','Is the hospital far?']],
    dialogue:{ title:'Lost in conversation', lines:[['A','คุณ พูด ภาษาไทย ได้ ไหม ครับ','Can you speak Thai?'],['B','ได้ นิดหน่อย ครับ พูด ช้า ช้า หน่อย ได้ ไหม ครับ','A little. Could you speak slowly?'],['A','ได้ ครับ เข้าใจ ไหม ครับ','Sure. Do you understand?'],['B','เข้าใจ แล้ว ครับ อัน นี้ เรียก ว่า อะไร ครับ','I understand now. What is this called?'],['A','เรียก ว่า จักรยาน ครับ','It\'s called a bicycle.'],['B','ขอบคุณ ครับ','Thank you.']] } },
]},
{ id:'u7', title:'Time', sub:'Today, tomorrow, what time, not yet', lessons:[
  { title:'Today and tomorrow',
    tip:['No tenses', 'Thai verbs have no past or future form. A time word does the job: <b>mûea-waan phǒm pai</b> = yesterday I go = "I went". For plans, put <b>jà</b> before the verb.'],
    items:[['วันนี้','today'],['พรุ่งนี้','tomorrow'],['เมื่อวาน','yesterday'],['ตอนนี้','now','⏰'],['จะ','will'],['พรุ่งนี้ ผม จะ ไป สนามบิน','Tomorrow I\'ll go to the airport'],['เมื่อวาน ผม ไป ร้านอาหาร','Yesterday I went to a restaurant']],
    mix:[['วันนี้ ร้อน มาก','It\'s very hot today'],['พรุ่งนี้ คุณ จะ ไป ไหน ครับ','Where will you go tomorrow?'],['ตอนนี้ ผม หิว','I\'m hungry now'],['วันนี้ ผม ไม่ สบาย','I\'m not well today'],['ตอนนี้ คุณ อยู่ ที่ไหน ครับ','Where are you now?']] },
  { title:'What time?',
    tip:['Clock basics', 'For daytime hours say number + <b>moong</b>: <b>sìp moong</b> = 10 o\'clock. <b>kìi moong</b> = how many o\'clock = what time? Thai has more clock words for night hours; this is enough to start.'],
    items:[['กี่ โมง ครับ','What time is it?'],['สิบ โมง','ten o\'clock'],['เมื่อไหร่','when'],['เปิด','open'],['ปิด','closed, to close'],['เปิด กี่ โมง ครับ','What time do you open?'],['ตอนเช้า','in the morning'],['ตอนเย็น','in the evening']],
    mix:[['ปิด แล้ว','already closed'],['คุณ จะ ไป เมื่อไหร่ ครับ','When will you go?'],['ร้านอาหาร ปิด กี่ โมง ครับ','What time does the restaurant close?'],['พรุ่งนี้ ตอนเช้า','tomorrow morning'],['วันนี้ เปิด ไหม ครับ','Are you open today?'],['เปิด เก้า โมง','It opens at nine']] },
  { title:'Wait, done, not yet',
    tip:['"Have you eaten yet?"', '<b>kin khâao rǔe yang</b> is a common friendly greeting, not an invitation. Answer <b>kin láew</b> (eaten already) or <b>yang</b> (not yet). <b>… rǔe yang</b> works with any verb.'],
    items:[['รอ แป๊บนึง ครับ','Wait a moment, please'],['ยัง ครับ','Not yet'],['เสร็จ แล้ว','Finished','✅'],['กิน ข้าว หรือ ยัง ครับ','Have you eaten yet?'],['เร็ว','fast'],['ห้า นาที','five minutes']],
    mix:[['รอ ห้า นาที ครับ','Wait five minutes, please'],['เสร็จ หรือ ยัง ครับ','Is it finished yet?'],['กิน แล้ว ครับ','I\'ve eaten'],['ยัง ไม่ เสร็จ','not finished yet'],['เร็ว เร็ว หน่อย ครับ','A bit faster, please'],['ถึง หรือ ยัง ครับ','Have we arrived yet?']],
    dialogue:{ title:'Lunch plans', lines:[['A','กิน ข้าว หรือ ยัง ครับ','Have you eaten yet?'],['B','ยัง ครับ ผม หิว มาก','Not yet. I\'m very hungry.'],['A','ไป ร้านอาหาร ไหม ครับ','Shall we go to a restaurant?'],['B','ไป ครับ เปิด หรือ ยัง ครับ','Let\'s go. Is it open yet?'],['A','เปิด แล้ว ครับ','It\'s open.'],['B','ดี มาก รอ แป๊บนึง ครับ','Great. Wait a moment, please.']] } },
]},
{ id:'u8', title:'People', sub:'Family, compliments, your life here', lessons:[
  { title:'Family and friends',
    tip:['Owner comes second', 'There is no "my" or "your". Put the owner after the thing: <b>phûean phǒm</b> = friend (of) me = my friend. To count people use <b>khon</b>: <b>sǎwng khon</b> = two people.'],
    items:[['เพื่อน','friend'],['แฟน','partner, boyfriend/girlfriend'],['ลูก','child (son/daughter)'],['พ่อ','father'],['แม่','mother'],['นี่ เพื่อน ผม ครับ','This is my friend'],['กี่ คน ครับ','How many people?'],['สอง คน ครับ','Two people']],
    mix:[['นี่ แฟน ผม ครับ','This is my partner'],['คุณ มี ลูก ไหม ครับ','Do you have children?'],['ผม มี ลูก สอง คน','I have two children'],['แม่ ผม สบายดี','My mother is well'],['เพื่อน คุณ ชื่อ อะไร ครับ','What\'s your friend\'s name?'],['พ่อ ผม ชอบ เบียร์','My father likes beer']] },
  { title:'Saying nice things',
    tip:['You will hear this a lot', 'Say three words of Thai and someone will tell you <b>phûut phaa-sǎa-thai kèng mâak</b> (you speak Thai so well). The modest reply is <b>nít-nàwy khráp</b> (just a little).'],
    items:[['สวย','beautiful'],['ใจดี','kind'],['สนุก','fun'],['ใหญ่','big'],['เล็ก','small'],['เก่ง','skilled, good at something'],['คุณ ใจดี มาก ครับ','You\'re very kind'],['คุณ พูด ภาษาไทย เก่ง มาก','You speak Thai very well']],
    mix:[['สนุก มาก','It\'s a lot of fun'],['สนุก ไหม ครับ','Is it fun?'],['โรงแรม ใหญ่ มาก','The hotel is very big'],['แฟน ผม ใจดี มาก','My partner is very kind'],['ขอ แก้ว เล็ก ครับ','A small glass, please'],['เพื่อน ผม เก่ง มาก','My friend is very good'],['สวย มาก','very beautiful']] },
  { title:'Work and home',
    tip:['Up to now', 'A time span + <b>láew</b> means "so far": <b>sǎwng pii láew</b> = two years already = "for two years now".'],
    items:[['ทำงาน','work'],['คุณ ทำงาน อะไร ครับ','What work do you do?'],['บ้าน','home, house'],['กลับ บ้าน','go home','🏡'],['เมืองไทย','Thailand'],['ผม ชอบ เมืองไทย มาก','I like Thailand very much'],['ปี','year','🗓️'],['ผม อยู่ เมืองไทย สอง ปี แล้ว','I\'ve lived in Thailand for two years']],
    mix:[['บ้าน คุณ อยู่ ที่ไหน ครับ','Where is your home?'],['ผม อยาก กลับ บ้าน','I want to go home'],['วันนี้ ผม ไม่ ทำงาน','I\'m not working today'],['พรุ่งนี้ ผม จะ กลับ บ้าน','Tomorrow I\'ll go home'],['คุณ อยู่ เมืองไทย กี่ ปี แล้ว ครับ','How many years have you lived in Thailand?'],['บ้าน ผม อยู่ ไกล','My home is far away']],
    dialogue:{ title:'Small talk', lines:[['A','คุณ มา จาก ไหน ครับ','Where are you from?'],['B','ผม มา จาก ฝรั่งเศส ครับ','I\'m from France.'],['A','คุณ อยู่ เมืองไทย กี่ ปี แล้ว ครับ','How many years have you lived in Thailand?'],['B','สอง ปี แล้ว ครับ ผม ชอบ เมืองไทย มาก','Two years now. I like Thailand very much.'],['A','คุณ พูด ภาษาไทย เก่ง มาก','You speak Thai very well.'],['B','นิดหน่อย ครับ ขอบคุณ ครับ คุณ ใจดี มาก ครับ','Just a little. Thank you, you\'re very kind.']] } },
]},
{ id:'u9', title:'Shopping and hotels', sub:'Buy, compare, check in', lessons:[
  { title:'Buying and paying',
    tip:['Stack what you know', '<b>jàai bàt dâi mǎi</b> = pay card can + question = "can I pay by card?". Nothing new here except two words. Most new sentences from now on are old patterns with new words.'],
    items:[['ซื้อ','buy'],['ตลาด','market'],['ผม อยาก ซื้อ อัน นี้','I want to buy this one'],['จ่าย','pay','💰'],['บัตร','card'],['จ่าย บัตร ได้ ไหม ครับ','Can I pay by card?'],['เงินสด','cash'],['ไม่ เอา ถุง ครับ','No bag, thanks','🛍️']],
    mix:[['ตลาด อยู่ ที่ไหน ครับ','Where is the market?'],['ผม จะ ไป ตลาด','I\'m going to the market'],['จ่าย เงินสด ครับ','I\'ll pay cash'],['คุณ อยาก ซื้อ อะไร ครับ','What do you want to buy?'],['ตลาด เปิด กี่ โมง ครับ','What time does the market open?'],['ผม ไม่ มี เงินสด','I don\'t have cash']] },
  { title:'Colours and comparing',
    tip:['kwàa = "-er"', 'Add <b>kwàa</b> after a describing word to compare: <b>yài kwàa</b> = bigger, <b>thùuk kwàa</b> = cheaper. And listen for the tone: <b>khǎao</b> (rising) is white, <b>khâao</b> (falling) is rice.'],
    items:[['สี แดง','red','🔴'],['สี ดำ','black','⚫'],['สี ขาว','white','⚪'],['ใหญ่ กว่า','bigger'],['มี ใหญ่ กว่า นี้ ไหม ครับ','Do you have a bigger one?'],['ลอง ได้ ไหม ครับ','Can I try it?'],['มี สี อื่น ไหม ครับ','Do you have another colour?']],
    mix:[['เล็ก กว่า','smaller'],['ถูก กว่า','cheaper'],['มี ถูก กว่า นี้ ไหม ครับ','Do you have a cheaper one?'],['เอา สี ดำ ครับ','I\'ll take the black one'],['ผม ชอบ สี แดง','I like red'],['อัน นี้ ดี กว่า','This one is better'],['มี สี ขาว ไหม ครับ','Do you have it in white?']] },
  { title:'At the hotel',
    tip:['lá = per', '<b>khuen lá thâo-rài</b> = night per how-much = "how much per night?". The same <b>lá</b> works for per person: <b>khon lá</b>.'],
    items:[['ห้อง','room'],['มี ห้อง ว่าง ไหม ครับ','Do you have a room free?'],['สอง คืน','two nights','🌙'],['คืน ละ เท่าไหร่ ครับ','How much per night?'],['ผม จอง ห้อง แล้ว','I\'ve booked a room'],['แอร์','air-con'],['กุญแจ','key']],
    mix:[['มี แอร์ ไหม ครับ','Is there air-con?'],['ห้อง ใหญ่ มาก','The room is very big'],['ขอ กุญแจ ครับ','The key, please'],['ไม่ มี น้ำ ร้อน','There\'s no hot water'],['ผม จะ อยู่ สาม คืน','I\'ll stay three nights'],['ห้อง นี้ ดี มาก','This room is very good'],['คืน ละ ห้า ร้อย บาท','five hundred baht per night']],
    dialogue:{ title:'Checking in', lines:[['B','สวัสดี ครับ มี ห้อง ว่าง ไหม ครับ','Hello, do you have a room free?'],['A','มี ครับ กี่ คืน ครับ','We do. How many nights?'],['B','สอง คืน ครับ คืน ละ เท่าไหร่ ครับ','Two nights. How much per night?'],['A','คืน ละ แปด ร้อย บาท ครับ','Eight hundred baht per night.'],['B','มี แอร์ ไหม ครับ','Is there air-con?'],['A','มี ครับ','There is.'],['B','ดี ครับ จ่าย บัตร ได้ ไหม ครับ','Good. Can I pay by card?'],['A','ได้ ครับ','You can.']] } },
]},
{ id:'u10', title:'Real conversation', sub:'Opinions, reasons, goodbyes', lessons:[
  { title:'What I think',
    tip:['Opinions', '<b>phǒm khít wâa</b> = I think that… Put any sentence you already know after it. <b>wâa</b> is the same "that / saying" you met in "what is this called".'],
    items:[['ผม คิด ว่า','I think that…','💭'],['จริง','true, real'],['จริง หรือ ครับ','Really?','😮'],['แน่นอน','of course'],['อาจจะ','maybe'],['ผม รัก เมืองไทย','I love Thailand'],['มีความสุข','happy'],['เสียใจ ด้วย ครับ','I\'m sorry to hear that']],
    mix:[['ผม คิด ว่า แพง มาก','I think it\'s very expensive'],['ผม คิด ว่า ไม่ ไกล','I think it\'s not far'],['ไม่ จริง','That\'s not true'],['คุณ คิด ว่า ดี ไหม ครับ','Do you think it\'s good?'],['อาจจะ พรุ่งนี้','maybe tomorrow'],['ผม มีความสุข มาก','I\'m very happy']] },
  { title:'Why, because, but',
    tip:['Joining ideas', 'With <b>tàe</b> (but), <b>phráw wâa</b> (because) and <b>kàp</b> (with) you can chain your short sentences into real speech. Say two things you know and put one of these between them.'],
    items:[['ทำไม','why'],['เพราะ ว่า','because'],['แต่','but'],['กับ','with, and'],['ไป ด้วยกัน ไหม ครับ','Shall we go together?'],['ผม ชอบ แต่ แพง มาก','I like it, but it\'s very expensive'],['ผม ไป กับ เพื่อน','I\'m going with a friend'],['คน ไทย','Thai people']],
    mix:[['ทำไม ไม่ ไป ครับ','Why aren\'t you going?'],['เพราะ ว่า ผม เหนื่อย','Because I\'m tired'],['อร่อย แต่ เผ็ด มาก','Delicious but very spicy'],['ขอ ข้าว กับ ไก่ ครับ','Rice with chicken, please'],['ผม อยาก ไป แต่ ไม่ มี รถ','I want to go but I have no car'],['ทำไม คุณ ชอบ เมืองไทย ครับ','Why do you like Thailand?'],['เพราะ ว่า คน ไทย ใจดี','Because Thai people are kind']] },
  { title:'Goodbyes',
    tip:['Leaving well', 'Thais announce they are leaving: <b>pai kàwn ná</b> = going first, okay? The little <b>ná</b> makes anything softer and warmer.'],
    items:[['ไป ก่อน นะ ครับ','I\'m off now','👋'],['แล้ว เจอ กัน ครับ','See you later'],['โชคดี ครับ','Good luck'],['ยินดี ครับ','You\'re welcome'],['เช่นกัน ครับ','Likewise, you too'],['เดินทาง ปลอดภัย นะ ครับ','Have a safe trip','🧳'],['ฝันดี ครับ','Sweet dreams']],
    mix:[['พรุ่งนี้ เจอ กัน ครับ','See you tomorrow'],['เจอ กัน ที่ โรงแรม','See you at the hotel'],['เจอ กัน กี่ โมง ครับ','What time shall we meet?'],['เจอ กัน ตอนเย็น','See you this evening'],['ขอบคุณ มาก ครับ โชคดี ครับ','Thank you very much. Good luck.']],
    dialogue:{ title:'Making plans', lines:[['A','พรุ่งนี้ คุณ จะ ไป ไหน ครับ','Where are you going tomorrow?'],['B','ผม จะ ไป ตลาด กับ เพื่อน ไป ด้วยกัน ไหม ครับ','I\'m going to the market with a friend. Shall we go together?'],['A','อยาก ไป แต่ พรุ่งนี้ ผม ทำงาน','I\'d like to, but I work tomorrow.'],['B','เสียใจ ด้วย ครับ','I\'m sorry to hear that.'],['A','ไม่เป็นไร ครับ ไป ก่อน นะ ครับ','No problem. I\'m off now.'],['B','โชคดี ครับ แล้ว เจอ กัน ครับ','Good luck. See you later.']] } },
]},
];
