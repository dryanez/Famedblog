# Complete translated editions: retain all source chapters, daily sessions and German exercises.
CASES_AN=['Migräne','Vertigo/Tinnitus','Mandelentzündung (Tonsillitis)','Halsschmerzen/Fatigue/Covid','Bronchialkarzinom','Thoraxschmerzen','Bauchschmerzen','Knieverletzung','Knieluxation','Sprunggelenkverletzung','Kolonkarzinom','Ösophaguskarzinom']
CASES_AUF=['Masteoidektomie','Appendektomie','Sigmoidektomie','Cholezystektomie','Thyroidektomie','Koloskopie','ÖGD','Koronarangiographie','TEE','elektrische Kardioversion','Bronchoskopie','Arthroskopie','Hüftgelenk','Kreuzbandriss','Perkutane Leberpunktion','Aszitespunktion','CT mit Kontrastmittel','MRT mit Kontrastmittel','Leistenhernie nach Lichtenstein','Hämorrhoidektomie']
CASES_BR=['Parkinson','Ösophaguskarzinom','Migräne 1','Migräne 2','Thoraxschmerzen 1','Thoraxschmerzen 2','Thoraxschmerzen 3','COVID-19','Husten 1','Husten 2','Fatigue und Leistungsabfall','Bauchschmerzen','Kolonkarzinom','Vertigo','Beinschmerzen']
CASES_AA=['Pneumonie','Asthma bronchiale','COPD','Anaphylaktischer Schock','Akute Pankreatitis','Akute Cholezystitis','Appendizitis','Leistenhernie links','Divertikulitis','Gastritis','Obere gastrointestinale Blutung','Hämorrhoidalleiden','Morbus Crohn','Polyarthritis rheumatica','Akutes Nierenversagen','Pyelonephritis','Panzytopenie','Eisenmangelanämie','Entgleisung bei Diabetes mellitus','Hypertensive Krise','NSTEMI','Vorhofflimmern','STEMI (Hinterwandinfarkt)','Kopfplatzwunde','BPLS','Rippenfraktur','Oberschenkelhalsfraktur','Schlüsselbeinfraktur','Kreuzbandriss und Meniskusschaden','Sprunggelenkfraktur','Mittelhandfraktur','Humerusfraktur']
# Each row is one day, with morning/afternoon/evening sessions and duration.
ES_WEEKS=[
('Fundamentos y Anamnese',[
('Estructura y evaluación','Lee la estructura del examen y el material de preparación. | 1 h','Comprende las tres estaciones y sus cinco tareas. | 65 min','Evalúa tu nivel de alemán con una prueba de práctica C1. | 30 min'),
('Esquema SAMPLER','Aprende a utilizar SAMPLER. | 1 h','Practica SAMPLER con Migräne. | 1 h','Practica con Thoraxschmerzen. | 45 min'),
('OPQRST para el dolor','Domina las preguntas de OPQRST. | 1 h','Practica con Bauchschmerzen. | 1 h','Practica con Knieverletzung. | 45 min'),
('Práctica de Anamnese I','Entrevista sobre Migräne en la app. | 1 h','Entrevista sobre Vertigo/Tinnitus. | 1 h','Entrevista sobre Mandelentzündung. | 45 min'),
('Práctica de Anamnese II','Trabaja Halsschmerzen/Fatigue/Covid. | 1 h','Trabaja Bronchialkarzinom con sensibilidad. | 1 h','Distingue dolor torácico cardíaco y no cardíaco. | 45 min'),
('Práctica de Anamnese III','Bauchschmerzen, Knieverletzung y Knieluxation. | 90 min','Sprunggelenkverletzung y Kolonkarzinom. | 1 h','Ösophaguskarzinom: practica la empatía. | 1 h'),
('Repaso y entrevista de prueba','Revisa todos los temas de anamnesis de la lista. | 1 h','Haz dos entrevistas aleatorias como entrenamiento. | 30 min','Descansa y prepara la segunda semana. | Descanso')]),
('Aufklärung: explicar procedimientos',[
('Cirugía básica','Mastoidektomie: procedimiento de ORL. | 1 h','Cholezystektomie: cirugía laparoscópica. | 1 h','Sigmoidektomie: cirugía intestinal. | 1 h'),
('Práctica quirúrgica','Appendektomie: cirugía urgente. | 1 h','Leistenhernie nach Lichtenstein. | 1 h','Hüftgelenk: cirugía ortopédica. | 1 h'),
('Procedimientos endoscópicos','ÖGD: endoscopia digestiva alta. | 1 h','Koloskopie: colonoscopia. | 1 h','Bronchoskopie: broncoscopia. | 1 h'),
('Corazón y vasos','Koronarangiographie: cateterismo cardíaco. | 1 h','TEE: ecocardiografía transesofágica. | 1 h','Elektrische Kardioversion. | 1 h'),
('Ortopedia y otros procedimientos','Arthroskopie: artroscopia de rodilla. | 1 h','Thyroidektomie: cirugía tiroidea. | 1 h','Hämorrhoidektomie. | 1 h'),
('Imagen e intervenciones','CT Thorax mit Kontrastmittel. | 1 h','MRT mit Kontrastmittel. | 1 h','Perkutane Leberpunktion y PTA; revisa también Aszitespunktion. | 1 h'),
('Repaso de Aufklärung','Revisa los primeros diez procedimientos. | 90 min','Revisa los procedimientos restantes. | 90 min','Practica una selección aleatoria en la app. | 1 h')]),
('Arzt–Arzt I: respiratorio, corazón y digestivo',[
('Casos respiratorios','Pneumonie 1: presentación con SBAR. | 1 h','Pneumonie 2: presentación diferente. | 1 h','Asthma bronchiale: exacerbación aguda. | 1 h'),
('COPD y consolidación','COPD: interpretación de gasometría. | 1 h','Practica los cuatro ejercicios respiratorios. | 90 min','Practica la voz pasiva y el estilo nominal. | 1 h'),
('Casos cardiovasculares','Vorhofflimmern: presentación del caso. | 1 h','NSTEMI: síndrome coronario agudo. | 1 h','Hypertensive Krise: emergencia. | 1 h'),
('Práctica cardíaca','Practica los tres casos cardiovasculares anteriores. | 90 min','Interpreta ECG y troponina de los ejercicios. | 1 h','Repasa vocabulario sobre urgencias. | 1 h'),
('Digestivo I','Komplizierte Appendizitis. | 1 h','Gastritis: aparato digestivo alto. | 1 h','Divertikulitis: aparato digestivo bajo. | 1 h'),
('Digestivo II','Pankreatitis: vocabulario y criterios Ranson del ejercicio. | 1 h','Chronische Cholezystitis. | 1 h','Gastroblutung: presentación de una hemorragia digestiva. | 1 h'),
('Repaso respiratorio, cardíaco y digestivo','Revisa los trece ejercicios de la semana. | 2 h','Practica cinco casos aleatorios. | 90 min','Descansa. | Descanso')]),
('Arzt–Arzt II: traumatología y otros sistemas',[
('Traumatología I','Kreuzbandriss: lesión del ligamento cruzado anterior. | 1 h','Rippenfraktur: fractura costal. | 1 h','Kopfplatzwunde: herida en la cabeza. | 1 h'),
('Traumatología II','Schlüsselbeinfraktur: clavícula. | 1 h','Oberschenkelhalsfraktur: cuello femoral. | 1 h','Sprunggelenkfraktur: tobillo. | 1 h'),
('Traumatología III','Mittelhandfraktur: metacarpiano. | 1 h','Humerusfraktur: húmero. | 1 h','Practica los ocho casos traumatológicos. | 1 h'),
('Otros sistemas I','Anaphylaktischer Schock: urgencia. | 1 h','BPLS: vértigo posicional paroxístico benigno. | 1 h','Diabetes mellitus: descompensación. | 1 h'),
('Otros sistemas II','Leistenhernie: hernia inguinal. | 1 h','Pyelonephritis: infección renal. | 1 h','Morbus Crohn: enfermedad inflamatoria intestinal. | 1 h'),
('Últimos casos Arzt–Arzt','Polyarthritis: vocabulario sobre artritis reumatoide. | 1 h','Niereninsuffizienz: insuficiencia renal. | 1 h','Selección aleatoria del conjunto de presentaciones. | 90 min'),
('Repaso completo de presentaciones','Revisa los casos por sistemas, incluidos los hematológicos. | 2 h','Practica las presentaciones de la app. | 90 min','Descansa. | Descanso')]),
('Arztbrief: documentación escrita',[
('Estructura y Konjunktiv I','Aprende la estructura del texto y la anamnesis escrita. | 1 h','Estudia las reglas de Konjunktiv I. | 1 h','Convierte el discurso directo en estilo indirecto. | 1 h'),
('Escritura I','Migräne: utiliza el ejercicio de escritura de la app. | 1 h','Vertigo: escribe con un límite de práctica de veinte minutos. | 1 h','Kolonkarzinom: redacta la anamnesis. | 1 h'),
('Escritura II','Parkinson: anamnesis escrita. | 1 h','Ösophaguskarzinom: anamnesis escrita. | 1 h','Thoraxschmerzen: anamnesis escrita. | 1 h'),
('Escritura III','Fatigue und Leistungsabfall. | 1 h','Erkältung/Covid: anamnesis escrita. | 1 h','Bauchschmerzen y Husten mit Sputum. | 1 h'),
('Velocidad y revisión','Escribe tres ejercicios de veinte minutos, cronometrados. | 90 min','Escribe otros tres ejercicios. | 90 min','Revisa los seis textos y localiza los errores. | 1 h'),
('Práctica avanzada','Practica en famedtestprep.com/brief. | 2 h','Practica fluidez al escribir o teclear según el formato. | 1 h','Prepara una estructura personal sin rellenar datos inventados. | 1 h'),
('Repaso y consolidación','Revisa todos los temas de escritura y sus variantes. | 2 h','Escribe dos anamnesis de casos aleatorios. | 90 min','Descansa. | Descanso')]),
('Integración y práctica completa',[
('Simulación de entrenamiento 1','Dos entrevistas de práctica y una Aufklärung. | 45 min','Una presentación Arzt–Arzt como ejercicio parcial. | 15 min','Una anamnesis escrita y revisión de errores. | 90 min'),
('Trabaja tus puntos débiles','Practica la tarea más débil del lunes. | 90 min','Practica la segunda tarea más débil. | 90 min','Repasa el vocabulario de esas áreas. | 1 h'),
('Simulación de entrenamiento 2','Combina las cuatro habilidades con casos distintos; usa el formato oficial para una simulación completa. | 2 h','Revisa el trabajo con un compañero. | 1 h','Anota las mejoras y las dificultades pendientes. | 1 h'),
('Profundización por habilidad','Anamnese: cuatro casos aleatorios. | 90 min','Aufklärung: cuatro casos aleatorios. | 90 min','Escritura: dos ejercicios. | 1 h'),
('Práctica intensiva Arzt–Arzt','Practica seis presentaciones de casos. | 2 h','Practica seis presentaciones más. | 2 h','Revisa tu estructura SBAR. | 1 h'),
('Simulación de entrenamiento 3','Completa las cuatro habilidades con las cinco tareas del formato vigente. | 2 h','Compara con las simulaciones 1 y 2. | 1 h','Identifica los últimos puntos débiles. | 1 h'),
('Descanso y repaso ligero','Repasa vocabulario sin sobrecargarte. | 45 min','Descanso completo. | Descanso','Prepara la semana 7. | Descanso')]),
('Afinar la práctica y ganar fluidez',[
('Práctica cronometrada','Cuatro entrevistas de diez minutos como entrenamiento. | 1 h','Cuatro explicaciones de diez minutos como entrenamiento. | 1 h','Dos textos con veinte minutos de escritura activa. | 1 h'),
('Maratón de presentaciones','Ocho casos Arzt–Arzt de diez minutos cada uno. | 2 h','Ocho casos Arzt–Arzt adicionales. | 2 h','Revisa y mejora tus presentaciones. | 1 h'),
('Práctica mixta','Ejercicios aleatorios de las cuatro habilidades en la app. | 2 h','Trabaja las transiciones y la empatía. | 1 h','Repite los casos difíciles. | 1 h'),
('Simulación de entrenamiento 4','Completa las cinco tareas del formato vigente. | 2 h','Haz una revisión detallada. | 1 h','Ajusta tu estrategia de trabajo. | 1 h'),
('Vocabulario y expresiones','Revisa las listas de vocabulario médico. | 2 h','Practica expresiones habituales para cada habilidad. | 1 h','Último repaso de Konjunktiv I. | 1 h'),
('Simulación de entrenamiento 5','Completa las cinco tareas del formato vigente. | 2 h','Revisión final con un compañero, si es posible. | 1 h','Revisa tus avances para ganar confianza. | 1 h'),
('Día de descanso','Repaso muy ligero con tarjetas. | 30 min','Descanso completo, sin estudiar. | Descanso','Actividad tranquila y acostarte temprano. | Descanso')]),
('Preparación final y examen',[
('Repaso ligero','Revisa SAMPLER, SBAR y OPQRST. | 1 h','Practica un caso de cada habilidad. | 1 h','Revisa los diez errores frecuentes. | 30 min'),
('Última práctica','Practica dos casos de Anamnese. | 30 min','Practica dos casos de Aufklärung. | 30 min','Practica dos presentaciones Arzt–Arzt. | 30 min'),
('Ganar confianza','Revisa tus mejores ejercicios. | 1 h','Repasa vocabulario de forma ligera. | 1 h','Prepara los documentos y materiales del examen. | 30 min'),
('Estudio mínimo','Repaso rápido de expresiones habituales. | 30 min','Descanso y relajación. | Descanso','Acuéstate temprano e intenta dormir ocho horas. | Descanso'),
('Día del examen','Desayuna y llega según las instrucciones de tu reserva. | Examen','Mantén la calma y aplica lo practicado. | Examen','Reconoce tu esfuerzo y espera las instrucciones de resultados. | Descanso')])]
AR_WEEKS=[
('الأساسيات وأخذ القصة المرضية',[
('بنية الامتحان وتقييم المستوى','اقرأ بنية الامتحان ومواد التحضير. | ساعة','افهم المحطات الثلاث والمهام الخمس. | 65 دقيقة','قيّم لغتك الألمانية باختبار تدريبي لمستوى C1. | 30 دقيقة'),
('منهج SAMPLER','تعلّم استخدام SAMPLER جيداً. | ساعة','تدرّب على SAMPLER مع حالة Migräne. | ساعة','تدرّب على حالة Thoraxschmerzen. | 45 دقيقة'),
('منهج OPQRST للألم','أتقن أسئلة تقييم الألم باستخدام OPQRST. | ساعة','تدرّب على Bauchschmerzen. | ساعة','تدرّب على Knieverletzung. | 45 دقيقة'),
('تدريب القصة المرضية الأول','مقابلة Migräne في التطبيق. | ساعة','مقابلة Vertigo/Tinnitus. | ساعة','مقابلة Mandelentzündung. | 45 دقيقة'),
('تدريب القصة المرضية الثاني','تدرّب على Halsschmerzen/Fatigue/Covid. | ساعة','ناقش Bronchialkarzinom بأسلوب متعاطف. | ساعة','ميّز بين ألم الصدر القلبي وغير القلبي. | 45 دقيقة'),
('تدريب القصة المرضية الثالث','Bauchschmerzen وKnieverletzung وKnieluxation. | 90 دقيقة','Sprunggelenkverletzung وKolonkarzinom. | ساعة','Ösophaguskarzinom: تدرّب على التعاطف. | ساعة'),
('المراجعة ومقابلات تجريبية','راجع جميع موضوعات القصة المرضية في القائمة. | ساعة','أجرِ مقابلتين عشوائيتين للتدريب. | 30 دقيقة','استرح واستعد للأسبوع الثاني. | راحة')]),
('Aufklärung: شرح الإجراءات للمريض',[
('أساسيات الجراحة','Mastoidektomie: إجراء في الأنف والأذن والحنجرة. | ساعة','Cholezystektomie: جراحة بالمنظار. | ساعة','Sigmoidektomie: جراحة الأمعاء. | ساعة'),
('التدريب الجراحي','Appendektomie: جراحة إسعافية. | ساعة','Leistenhernie nach Lichtenstein. | ساعة','Hüftgelenk: جراحة عظمية. | ساعة'),
('إجراءات التنظير','ÖGD: تنظير الجهاز الهضمي العلوي. | ساعة','Koloskopie: تنظير القولون. | ساعة','Bronchoskopie: تنظير القصبات. | ساعة'),
('القلب والأوعية','Koronarangiographie: قسطرة القلب. | ساعة','TEE: تخطيط صدى القلب عبر المريء. | ساعة','Elektrische Kardioversion. | ساعة'),
('العظام وإجراءات أخرى','Arthroskopie: تنظير الركبة. | ساعة','Thyroidektomie: جراحة الغدة الدرقية. | ساعة','Hämorrhoidektomie. | ساعة'),
('التصوير والتداخلات','CT Thorax mit Kontrastmittel. | ساعة','MRT mit Kontrastmittel. | ساعة','Perkutane Leberpunktion وPTA؛ راجع أيضاً Aszitespunktion. | ساعة'),
('مراجعة Aufklärung','راجع الإجراءات العشرة الأولى. | 90 دقيقة','راجع بقية الإجراءات. | 90 دقيقة','تدرّب على اختيار عشوائي في التطبيق. | ساعة')]),
('Arzt–Arzt الأول: التنفس والقلب والهضم',[
('حالات الجهاز التنفسي','Pneumonie 1: عرض الحالة باستخدام SBAR. | ساعة','Pneumonie 2: عرض مختلف. | ساعة','Asthma bronchiale: تفاقم حاد. | ساعة'),
('COPD وتثبيت المهارات','COPD: تفسير غازات الدم. | ساعة','تدرّب على الحالات التنفسية الأربع. | 90 دقيقة','تدرّب على المبني للمجهول والأسلوب الاسمي. | ساعة'),
('حالات القلب والأوعية','Vorhofflimmern: عرض الحالة. | ساعة','NSTEMI: متلازمة الشريان التاجي الحادة. | ساعة','Hypertensive Krise: حالة طارئة. | ساعة'),
('التدريب القلبي','تدرّب على الحالات القلبية الثلاث السابقة. | 90 دقيقة','فسّر ECG والتروبونين في التمارين. | ساعة','راجع مفردات تدبير الطوارئ. | ساعة'),
('الجهاز الهضمي الأول','Komplizierte Appendizitis. | ساعة','Gastritis: الجهاز الهضمي العلوي. | ساعة','Divertikulitis: الجهاز الهضمي السفلي. | ساعة'),
('الجهاز الهضمي الثاني','Pankreatitis: المفردات ومعايير Ranson في التمرين. | ساعة','Chronische Cholezystitis. | ساعة','Gastroblutung: عرض حالة نزف هضمي. | ساعة'),
('مراجعة التنفس والقلب والهضم','راجع التمارين الثلاثة عشر لهذا الأسبوع. | ساعتان','تدرّب على خمس حالات عشوائية. | 90 دقيقة','استرح. | راحة')]),
('Arzt–Arzt الثاني: الرضوض والأجهزة الأخرى',[
('الرضوض الأول','Kreuzbandriss: تمزق الرباط الصليبي الأمامي. | ساعة','Rippenfraktur: كسر ضلع. | ساعة','Kopfplatzwunde: جرح في الرأس. | ساعة'),
('الرضوض الثاني','Schlüsselbeinfraktur: كسر الترقوة. | ساعة','Oberschenkelhalsfraktur: كسر عنق الفخذ. | ساعة','Sprunggelenkfraktur: كسر الكاحل. | ساعة'),
('الرضوض الثالث','Mittelhandfraktur: كسر عظم مشط اليد. | ساعة','Humerusfraktur: كسر العضد. | ساعة','تدرّب على حالات الرضوض الثماني. | ساعة'),
('أجهزة أخرى أولاً','Anaphylaktischer Schock: حالة طارئة. | ساعة','BPLS: دوار الوضعة الانتيابي الحميد. | ساعة','Diabetes mellitus: عدم المعاوضة. | ساعة'),
('أجهزة أخرى ثانياً','Leistenhernie: فتق أربي. | ساعة','Pyelonephritis: التهاب الكلية. | ساعة','Morbus Crohn: داء الأمعاء الالتهابي. | ساعة'),
('الحالات الأخيرة للعرض','Polyarthritis: مفردات التهاب المفاصل الروماتويدي. | ساعة','Niereninsuffizienz: قصور كلوي. | ساعة','اختيار عشوائي من مجموعة عروض الحالات. | 90 دقيقة'),
('مراجعة شاملة للعروض','راجع الحالات بحسب الأجهزة، بما فيها أمراض الدم. | ساعتان','تدرّب على عروض الحالات في التطبيق. | 90 دقيقة','استرح. | راحة')]),
('Arztbrief: التوثيق الكتابي',[
('البنية وKonjunktiv I','تعلّم بنية النص وكتابة القصة المرضية. | ساعة','أتقن قواعد Konjunktiv I. | ساعة','حوّل الكلام المباشر إلى الكلام المنقول. | ساعة'),
('الكتابة الأولى','Migräne: استخدم تمرين الكتابة في التطبيق. | ساعة','Vertigo: اكتب خلال عشرين دقيقة تدريبية. | ساعة','Kolonkarzinom: اكتب القصة المرضية. | ساعة'),
('الكتابة الثانية','Parkinson: قصة مرضية مكتوبة. | ساعة','Ösophaguskarzinom: قصة مرضية مكتوبة. | ساعة','Thoraxschmerzen: قصة مرضية مكتوبة. | ساعة'),
('الكتابة الثالثة','Fatigue und Leistungsabfall. | ساعة','Erkältung/Covid: قصة مرضية مكتوبة. | ساعة','Bauchschmerzen وHusten mit Sputum. | ساعة'),
('السرعة والمراجعة','اكتب ثلاثة تمارين، عشرين دقيقة لكل منها، مع توقيت. | 90 دقيقة','اكتب ثلاثة تمارين إضافية. | 90 دقيقة','راجع النصوص الستة وحدد الأخطاء. | ساعة'),
('تدريب متقدم','تدرّب عبر famedtestprep.com/brief. | ساعتان','تدرّب على انسيابية الكتابة أو الطباعة بحسب الصيغة. | ساعة','جهّز بنية شخصية دون ملء معلومات مختلقة. | ساعة'),
('المراجعة وتثبيت المهارات','راجع جميع موضوعات الكتابة وصيغها المختلفة. | ساعتان','اكتب قصتين مرضيتين لحالتين عشوائيتين. | 90 دقيقة','استرح. | راحة')]),
('دمج المهارات والتدريب الكامل',[
('محاكاة تدريبية أولى','مقابلتان تدريبيتان للقصة المرضية وشرح إجراء واحد. | 45 دقيقة','عرض Arzt–Arzt واحد كتمرين جزئي. | 15 دقيقة','قصة مرضية مكتوبة ومراجعة الأخطاء. | 90 دقيقة'),
('استهداف نقاط الضعف','تدرّب على أضعف مهمة من يوم الاثنين. | 90 دقيقة','تدرّب على ثاني أضعف مهمة. | 90 دقيقة','راجع مفردات المجالات الضعيفة. | ساعة'),
('محاكاة تدريبية ثانية','اجمع المهارات الأربع بحالات مختلفة؛ استخدم الصيغة الرسمية للمحاكاة الكاملة. | ساعتان','راجع العمل بالتفصيل مع زميل. | ساعة','دوّن التحسن والصعوبات الباقية. | ساعة'),
('التعمق في كل مهارة','Anamnese: أربع حالات عشوائية. | 90 دقيقة','Aufklärung: أربع حالات عشوائية. | 90 دقيقة','الكتابة: تمرينان. | ساعة'),
('تدريب مكثف على Arzt–Arzt','تدرّب على ستة عروض حالات. | ساعتان','تدرّب على ستة عروض إضافية. | ساعتان','راجع بنية SBAR. | ساعة'),
('محاكاة تدريبية ثالثة','أكمل المهارات الأربع والمهام الخمس للصيغة الحالية. | ساعتان','قارن بالمحاكاتين الأولى والثانية. | ساعة','حدد آخر نقاط الضعف. | ساعة'),
('راحة ومراجعة خفيفة','مراجعة خفيفة للمفردات. | 45 دقيقة','راحة كاملة. | راحة','الاستعداد للأسبوع السابع. | راحة')]),
('تحسين الأداء والسرعة',[
('تدريب مع التوقيت','أربع مقابلات، عشر دقائق تدريبية لكل منها. | ساعة','أربعة شروحات، عشر دقائق تدريبية لكل منها. | ساعة','نصان، عشرون دقيقة للكتابة الفعلية لكل منهما. | ساعة'),
('تدريب مكثف على العروض','ثماني حالات Arzt–Arzt، عشر دقائق لكل منها. | ساعتان','ثماني حالات إضافية. | ساعتان','راجع العروض وحسّنها. | ساعة'),
('تدريب متنوع','تمارين عشوائية للمهارات الأربع في التطبيق. | ساعتان','ركّز على الانتقالات والتعاطف. | ساعة','تدرّب على الحالات الصعبة. | ساعة'),
('محاكاة تدريبية رابعة','أكمل المهام الخمس للصيغة الحالية. | ساعتان','راجع أداءك بالتفصيل. | ساعة','عدّل استراتيجية العمل. | ساعة'),
('المفردات والتعبيرات','راجع قوائم المفردات الطبية. | ساعتان','تدرّب على التعبيرات المعتادة لكل مهارة. | ساعة','مراجعة أخيرة لـKonjunktiv I. | ساعة'),
('محاكاة تدريبية خامسة','أكمل المهام الخمس للصيغة الحالية. | ساعتان','مراجعة أخيرة مع زميل إن أمكن. | ساعة','راجع تقدمك لبناء الثقة. | ساعة'),
('يوم راحة','مراجعة خفيفة جداً بالبطاقات. | 30 دقيقة','راحة كاملة دون دراسة. | راحة','نشاط هادئ والنوم مبكراً. | راحة')]),
('التحضير الأخير والامتحان',[
('مراجعة خفيفة','راجع SAMPLER وSBAR وOPQRST. | ساعة','تدرّب على حالة لكل مهارة. | ساعة','راجع الأخطاء العشرة الشائعة. | 30 دقيقة'),
('التدريب الأخير','تدرّب على حالتي Anamnese. | 30 دقيقة','تدرّب على حالتي Aufklärung. | 30 دقيقة','تدرّب على عرضي Arzt–Arzt. | 30 دقيقة'),
('بناء الثقة','راجع أفضل تمارينك. | ساعة','مراجعة خفيفة للمفردات. | ساعة','جهّز وثائق الامتحان ومواده. | 30 دقيقة'),
('الحد الأدنى من الدراسة','مراجعة سريعة للتعبيرات المعتادة. | 30 دقيقة','راحة واسترخاء. | راحة','نم مبكراً وحاول النوم ثماني ساعات. | راحة'),
('يوم الامتحان','تناول الفطور واحضر وفق تعليمات الحجز. | الامتحان','حافظ على الهدوء وطبّق ما تدرّبت عليه. | الامتحان','قدّر جهدك وانتظر تعليمات النتائج. | راحة')])]
