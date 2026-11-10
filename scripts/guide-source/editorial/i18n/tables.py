# Key-facts and exam-structure tables for the guide (Nov 2026).
# Facts table: from https://famed-test.de/ (fee "530,- EURO", sites Mainz/Kassel/Nürnberg, results "ca. 4 Wochen",
# recognition by federal state), checked 10 Nov 2026. Exam table: same facts as the "format" chapter (famed-test.de/pruefungsablauf).
SRC = 'famed-test.de'
FACTS = {
 'es': dict(t='Datos clave del examen', rows=[('Precio', '530 €'), ('Sedes', 'Mainz · Kassel · Nürnberg'), ('Resultados', 'aprox. 4 semanas después del examen'),
   ('Reconocimiento', 'Baviera y Renania-Palatinado: reconocimiento general · Hesse: solo títulos de la UE · Baden-Wurtemberg: aceptación condicionada (adjuntar copia a la solicitud) · Sarre, Turingia y Sajonia-Anhalt: decisión caso por caso de la autoridad competente')],
   note='Fuente: famed-test.de, consultado el 10 de noviembre de 2026. Confirma precio, fechas y reconocimiento con el organizador y tu autoridad.'),
 'en': dict(t='Key exam facts', rows=[('Fee', '€530'), ('Test centres', 'Mainz · Kassel · Nürnberg'), ('Results', 'about 4 weeks after the exam'),
   ('Recognition', 'Bavaria and Rhineland-Palatinate: generally recognised · Hesse: EU degrees only · Baden-Württemberg: conditional (attach a copy to your application) · Saarland, Thuringia and Saxony-Anhalt: case-by-case decision by the authority')],
   note='Source: famed-test.de, checked 10 November 2026. Confirm fee, dates and recognition with the organiser and your authority.'),
 'de': dict(t='Die wichtigsten Fakten', rows=[('Gebühr', '530 €'), ('Prüfungsorte', 'Mainz · Kassel · Nürnberg'), ('Ergebnis', 'in der Regel ca. 4 Wochen nach der Prüfung'),
   ('Anerkennung', 'Bayern und Rheinland-Pfalz: grundsätzliche Anerkennung · Hessen: ausschließlich für EU-Studienabschlüsse · Baden-Württemberg: unter Vorbehalt (Kopie dem Antrag beilegen) · Saarland, Thüringen, Sachsen-Anhalt: Einzelfallentscheidung der zuständigen Behörde')],
   note='Quelle: famed-test.de, Stand 10. November 2026. Gebühr, Termine und Anerkennung bitte beim Veranstalter und Ihrer Behörde bestätigen.'),
 'ar': dict(t='معلومات أساسية عن الامتحان', rows=[('الرسوم', '530 €'), ('مراكز الامتحان', 'Mainz · Kassel · Nürnberg'), ('النتيجة', 'بعد نحو 4 أسابيع من الامتحان'),
   ('الاعتراف', 'بافاريا وراينلاند-بفالتس: اعتراف عام · هيسن: لشهادات الاتحاد الأوروبي فقط · بادن-فورتمبيرغ: قبول مشروط (أرفق نسخة بالطلب) · زارلاند وتورينغن وساكسونيا-أنهالت: قرار فردي من الجهة المختصة')],
   note='المصدر: famed-test.de، بتاريخ 10 نوفمبر 2026. تحقّق من الرسوم والمواعيد والاعتراف لدى المنظّم والجهة المختصة.'),
 'ru': dict(t='Главное об экзамене', rows=[('Стоимость', '530 €'), ('Где сдают', 'Mainz · Kassel · Nürnberg'), ('Результат', 'примерно через 4 недели после экзамена'),
   ('Признание', 'Бавария и Рейнланд-Пфальц: признаётся в целом · Гессен: только для дипломов ЕС · Баден-Вюртемберг: с оговоркой (приложите копию к заявлению) · Саар, Тюрингия, Саксония-Анхальт: решение ведомства в каждом случае')],
   note='Источник: famed-test.de, данные на 10 ноября 2026 г. Уточняйте стоимость, даты и признание у организатора и в своём ведомстве.'),
 'fr': dict(t='L’examen en bref', rows=[('Tarif', '530 €'), ('Centres', 'Mainz · Kassel · Nürnberg'), ('Résultats', 'environ 4 semaines après l’examen'),
   ('Reconnaissance', 'Bavière et Rhénanie-Palatinat : reconnaissance générale · Hesse : diplômes de l’UE uniquement · Bade-Wurtemberg : sous condition (joindre une copie à la demande) · Sarre, Thuringe, Saxe-Anhalt : décision au cas par cas de l’autorité')],
   note='Source : famed-test.de, consulté le 10 novembre 2026. Vérifiez tarif, dates et reconnaissance auprès de l’organisateur et de votre autorité.'),
 'tr': dict(t='Sınav hakkında temel bilgiler', rows=[('Ücret', '530 €'), ('Sınav yerleri', 'Mainz · Kassel · Nürnberg'), ('Sonuç', 'sınavdan yaklaşık 4 hafta sonra'),
   ('Tanınma', 'Bavyera ve Renanya-Pfalz: genel olarak tanınır · Hessen: yalnızca AB diplomaları · Baden-Württemberg: koşullu (başvuruya kopya ekleyin) · Saarland, Thüringen, Saksonya-Anhalt: yetkili makamın her duruma özel kararı')],
   note='Kaynak: famed-test.de, 10 Kasım 2026 itibarıyla. Ücreti, tarihleri ve tanınmayı organizatör ve yetkili makamla teyit edin.'),
}
EXAM = {
 'es': dict(h=('Estación', 'Qué haces', 'Tiempo'), rows=[('1 · Arzt–Patient', 'Anamnese + Aufklärung', '23 min, incluida la lectura'), ('2 · Arzt–Arzt', 'Dos presentaciones de pacientes', '23 min, incluida la lectura'), ('3 · Escrito', 'Anamnesis de un Arztbrief a partir de un vídeo', '22 min, incluido el vídeo')], foot='Máx. 11 min por situación oral · 1 min de descanso entre estaciones · la estación escrita va al final'),
 'en': dict(h=('Station', 'What you do', 'Time'), rows=[('1 · Arzt–Patient', 'Anamnese + Aufklärung', '23 min incl. reading'), ('2 · Arzt–Arzt', 'Two patient presentations', '23 min incl. reading'), ('3 · Written', 'Anamnesis part of an Arztbrief from a video', '22 min incl. video')], foot='Max. 11 min per oral situation · 1 min break between stations · the written station comes last'),
 'de': dict(h=('Station', 'Aufgabe', 'Zeit'), rows=[('1 · Arzt–Patient', 'Anamnese + Aufklärung', '23 Min. inkl. Lesezeit'), ('2 · Arzt–Arzt', 'Zwei Patientenvorstellungen', '23 Min. inkl. Lesezeit'), ('3 · Schriftlich', 'Anamneseteil eines Arztbriefs nach Video', '22 Min. inkl. Video')], foot='Max. 11 Min. pro mündlicher Situation · 1 Min. Pause zwischen den Stationen · die schriftliche Station kommt zuletzt'),
 'ar': dict(h=('المحطة', 'المطلوب', 'الوقت'), rows=[('1 · Arzt–Patient', 'Anamnese + Aufklärung', '23 دقيقة مع القراءة'), ('2 · Arzt–Arzt', 'عرضان لمريضين', '23 دقيقة مع القراءة'), ('3 · الكتابة', 'جزء القصة المرضية في Arztbrief من فيديو', '22 دقيقة مع الفيديو')], foot='11 دقيقة كحد أقصى لكل موقف شفهي · دقيقة استراحة بين المحطات · المحطة الكتابية في النهاية'),
 'ru': dict(h=('Станция', 'Что делаете', 'Время'), rows=[('1 · Arzt–Patient', 'Anamnese + Aufklärung', '23 мин, включая чтение'), ('2 · Arzt–Arzt', 'Две презентации пациентов', '23 мин, включая чтение'), ('3 · Письменная', 'Анамнез для Arztbrief по видео', '22 мин, включая видео')], foot='Не более 11 мин на устную ситуацию · 1 мин перерыв между станциями · письменная станция последняя'),
 'fr': dict(h=('Station', 'Ce que vous faites', 'Durée'), rows=[('1 · Arzt–Patient', 'Anamnese + Aufklärung', '23 min, lecture comprise'), ('2 · Arzt–Arzt', 'Deux présentations de patients', '23 min, lecture comprise'), ('3 · Écrit', 'Partie anamnèse d’un Arztbrief à partir d’une vidéo', '22 min, vidéo comprise')], foot='11 min max. par situation orale · 1 min de pause entre les stations · l’écrit a lieu en dernier'),
 'tr': dict(h=('İstasyon', 'Ne yapıyorsunuz', 'Süre'), rows=[('1 · Arzt–Patient', 'Anamnese + Aufklärung', 'Okuma dahil 23 dk'), ('2 · Arzt–Arzt', 'İki hasta sunumu', 'Okuma dahil 23 dk'), ('3 · Yazılı', 'Videodan Arztbrief anamnez bölümü', 'Video dahil 22 dk')], foot='Sözlü durum başına en fazla 11 dk · istasyonlar arası 1 dk ara · yazılı istasyon en sonda'),
}
