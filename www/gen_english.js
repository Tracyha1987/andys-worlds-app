/* Andy's Worlds — English (Word Wizard Tower) question generator + hand-written grammar/reading.
   Tagged with California ELA Common Core standards (L = Language, RL/RI = Reading). */
(function () {
  'use strict';
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var sample = function (a, n, not) { var c = a.filter(function (x) { return not.indexOf(x) < 0; }), o = []; while (o.length < n && c.length) o.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); return o; };

  // [word, synonym, antonym, vietnamese meaning, level 1=gr4-5, 2=gr6-7, 3=gr8-10]
  var W = [
    ['big', 'large', 'small', 'to', 1], ['happy', 'glad', 'sad', 'vui', 1], ['fast', 'quick', 'slow', 'nhanh', 1], ['begin', 'start', 'finish', 'bắt đầu', 1],
    ['brave', 'bold', 'scared', 'dũng cảm', 1], ['easy', 'simple', 'hard', 'dễ', 1], ['shout', 'yell', 'whisper', 'la to', 1], ['quiet', 'silent', 'noisy', 'yên lặng', 1],
    ['smart', 'clever', 'foolish', 'thông minh', 1], ['angry', 'mad', 'calm', 'tức giận', 1], ['tiny', 'little', 'huge', 'nhỏ xíu', 1], ['rich', 'wealthy', 'poor', 'giàu', 1],
    ['ancient', 'old', 'modern', 'cổ xưa', 2], ['enormous', 'gigantic', 'minuscule', 'khổng lồ', 2], ['generous', 'giving', 'selfish', 'hào phóng', 2], ['timid', 'shy', 'confident', 'nhút nhát', 2],
    ['victory', 'win', 'defeat', 'chiến thắng', 2], ['accept', 'receive', 'refuse', 'chấp nhận', 2], ['fragile', 'delicate', 'sturdy', 'dễ vỡ', 2], ['vacant', 'empty', 'occupied', 'trống', 2],
    ['rapid', 'swift', 'sluggish', 'nhanh chóng', 2], ['expand', 'grow', 'shrink', 'mở rộng', 2], ['honest', 'truthful', 'deceitful', 'trung thực', 2], ['permanent', 'lasting', 'temporary', 'lâu dài', 2],
    ['abundant', 'plentiful', 'scarce', 'dồi dào', 3], ['benevolent', 'kind', 'malicious', 'nhân từ', 3], ['candid', 'frank', 'evasive', 'thẳng thắn', 3], ['diligent', 'hardworking', 'lazy', 'chăm chỉ', 3],
    ['obscure', 'unclear', 'obvious', 'mơ hồ', 3], ['frugal', 'thrifty', 'wasteful', 'tiết kiệm', 3], ['hostile', 'unfriendly', 'friendly', 'thù địch', 3], ['meticulous', 'careful', 'careless', 'tỉ mỉ', 3],
    ['reluctant', 'unwilling', 'eager', 'miễn cưỡng', 3], ['transparent', 'clear', 'opaque', 'trong suốt', 3], ['vivid', 'bright', 'dull', 'sống động', 3], ['concise', 'brief', 'wordy', 'ngắn gọn', 3]
  ];
  // irregular verbs [base, past, wrong1, wrong2, vietnamese]
  var V = [['go', 'went', 'goed', 'gone', 'đi'], ['eat', 'ate', 'eated', 'eaten', 'ăn'], ['see', 'saw', 'seed', 'seen', 'nhìn thấy'], ['run', 'ran', 'runned', 'rans', 'chạy'],
    ['swim', 'swam', 'swimmed', 'swum', 'bơi'], ['write', 'wrote', 'writed', 'written', 'viết'], ['take', 'took', 'taked', 'taken', 'lấy'], ['fly', 'flew', 'flied', 'flown', 'bay'],
    ['bring', 'brought', 'bringed', 'brang', 'mang'], ['think', 'thought', 'thinked', 'thank', 'nghĩ'], ['catch', 'caught', 'catched', 'cought', 'bắt'], ['teach', 'taught', 'teached', 'tought', 'dạy'],
    ['sing', 'sang', 'singed', 'sung', 'hát'], ['drink', 'drank', 'drinked', 'drunk', 'uống'], ['break', 'broke', 'breaked', 'broken', 'làm vỡ'], ['choose', 'chose', 'choosed', 'chosen', 'chọn'],
    ['freeze', 'froze', 'freezed', 'frozen', 'đóng băng'], ['buy', 'bought', 'buyed', 'baught', 'mua'], ['sleep', 'slept', 'sleeped', 'slep', 'ngủ'], ['begin', 'began', 'beginned', 'begun', 'bắt đầu']];
  // plurals [singular, plural, wrong1, wrong2, vi]
  var P = [['child', 'children', 'childs', 'childes', 'đứa trẻ'], ['mouse', 'mice', 'mouses', 'mices', 'con chuột'], ['tooth', 'teeth', 'tooths', 'teeths', 'răng'], ['foot', 'feet', 'foots', 'feets', 'bàn chân'],
    ['goose', 'geese', 'gooses', 'geeses', 'con ngỗng'], ['leaf', 'leaves', 'leafs', 'leafes', 'chiếc lá'], ['knife', 'knives', 'knifes', 'knive', 'con dao'], ['box', 'boxes', 'boxs', 'boxies', 'cái hộp'],
    ['city', 'cities', 'citys', 'cityes', 'thành phố'], ['person', 'people', 'persons', 'peoples', 'người'], ['woman', 'women', 'womans', 'womens', 'phụ nữ'], ['wolf', 'wolves', 'wolfs', 'wolfes', 'con sói'],
    ['cactus', 'cacti', 'cactuss', 'cactis', 'cây xương rồng'], ['sheep', 'sheep', 'sheeps', 'sheepes', 'con cừu'], ['fish', 'fish', 'fishs', 'fishies', 'con cá'], ['hero', 'heroes', 'heros', 'heroies', 'anh hùng']];
  // prefixes / suffixes [affix, meaning, example, vi meaning, level]
  var A = [['un-', 'not', 'unhappy', 'không', 1], ['re-', 'again', 'rewrite', 'lại', 1], ['pre-', 'before', 'preview', 'trước', 1], ['mis-', 'wrongly', 'misspell', 'sai', 1],
    ['dis-', 'opposite of', 'disagree', 'ngược lại', 1], ['-less', 'without', 'fearless', 'không có', 1], ['-ful', 'full of', 'joyful', 'đầy', 1], ['sub-', 'under', 'submarine', 'dưới', 2],
    ['inter-', 'between', 'international', 'giữa', 2], ['trans-', 'across', 'transport', 'xuyên qua', 2], ['bio-', 'life', 'biology', 'sự sống', 2], ['geo-', 'earth', 'geography', 'trái đất', 2],
    ['tele-', 'far', 'telescope', 'xa', 2], ['micro-', 'small', 'microscope', 'nhỏ', 2], ['-ology', 'study of', 'zoology', 'môn học về', 3], ['anti-', 'against', 'antibiotic', 'chống lại', 3],
    ['bene-', 'good', 'benefit', 'tốt', 3], ['mal-', 'bad', 'malfunction', 'xấu, hỏng', 3], ['chron-', 'time', 'chronological', 'thời gian', 3], ['-phobia', 'fear of', 'claustrophobia', 'nỗi sợ', 3]];
  // homophone sentences [sentence with ___, answer, wrongs..., why en, why vi]
  var H = [['___ dog is barking loudly.', 'Their', ['There', "They're", 'Thier'], "'Their' shows ownership (the dog belongs to them).", "'Their' chỉ sở hữu (con chó của họ)."],
    ['Put the book over ___.', 'there', ['their', "they're", 'thare'], "'There' means a place.", "'There' chỉ nơi chốn."],
    ["___ going to the park later.", "They're", ['Their', 'There', 'Theyre'], "'They're' = they are.", "'They're' là viết tắt của 'they are'."],
    ["___ my backpack?", 'Where', ['Wear', 'Were', 'Ware'], "'Where' asks about a place.", "'Where' dùng để hỏi nơi chốn."],
    ['I will ___ my new jacket.', 'wear', ['where', 'were', 'ware'], "'Wear' means to put on clothes.", "'Wear' là mặc (quần áo)."],
    ["___ turn is it?", 'Whose', ["Who's", 'Whos', 'Hose'], "'Whose' asks who owns something.", "'Whose' hỏi của ai."],
    ['The cat licked ___ paw.', 'its', ["it's", "its'", 'it'], "'Its' shows ownership; 'it's' means 'it is'.", "'Its' chỉ sở hữu; 'it's' nghĩa là 'it is'."],
    ["I want to go, ___.", 'too', ['to', 'two', 'tow'], "'Too' means also.", "'Too' nghĩa là cũng."],
    ['She has ___ sisters.', 'two', ['to', 'too', 'tu'], "'Two' is the number 2.", "'Two' là số 2."],
    ['The wind ___ the leaves away.', 'blew', ['blue', 'blewed', 'blow'], "'Blew' is the past of 'blow'; 'blue' is a color.", "'Blew' là quá khứ của 'blow' (thổi); 'blue' là màu xanh."],
    ["I ___ the answer!", 'know', ['no', 'now', 'knew'], "'Know' means to have the information.", "'Know' là biết."],
    ['This is better ___ that.', 'than', ['then', 'that', 'thin'], "'Than' compares things; 'then' is about time.", "'Than' dùng để so sánh; 'then' chỉ thời gian."],
    ["You're going to ___ the game if you don't practice.", 'lose', ['loose', 'loss', 'lost'], "'Lose' means to not win; 'loose' means not tight.", "'Lose' là thua/mất; 'loose' là lỏng."],
    ['The rain had a big ___ on the picnic.', 'effect', ['affect', 'effort', 'afect'], "'Effect' is usually a noun (a result); 'affect' is usually a verb.", "'Effect' thường là danh từ (kết quả); 'affect' thường là động từ."]];

  function lvl(g) { return g <= 5 ? 1 : g <= 7 ? 2 : 3; }
  function it(q, correct, wrongs, en, vi, hint, key, topic) {
    var o = [correct], seen = {}; seen[correct] = 1;
    wrongs.forEach(function (w) { if (o.length < 4 && !seen[w]) { seen[w] = 1; o.push(w); } });
    return [q, o, 0, en, vi, hint, { key: 'gen:' + key, topic: topic }];
  }
  function words(g) { var L = lvl(g); return W.filter(function (w) { return w[4] <= L && w[4] >= L - 1; }); }

  var T = {
    syn: function (g) { var ws = words(g), w = pick(ws), others = sample(ws, 3, [w]).map(function (x) { return x[1]; });
      return it('Which word means almost the SAME as "' + w[0] + '"?', w[1], others.concat([w[2]]), '"' + w[0] + '" and "' + w[1] + '" are synonyms (similar meaning).', '"' + w[0] + '" và "' + w[1] + '" là từ đồng nghĩa, đều có nghĩa "' + w[3] + '".', 'Từ đồng nghĩa = nghĩa gần giống.', 'syn', 'L.' + g + '.5 · Synonyms'); },
    ant: function (g) { var ws = words(g), w = pick(ws), others = sample(ws, 3, [w]).map(function (x) { return x[2]; });
      return it('Which word is the OPPOSITE of "' + w[0] + '"?', w[2], [w[1]].concat(others), '"' + w[2] + '" is the antonym (opposite) of "' + w[0] + '".', '"' + w[2] + '" là từ trái nghĩa của "' + w[0] + '" (' + w[3] + ').', 'Từ trái nghĩa = nghĩa ngược lại.', 'ant', 'L.' + g + '.5 · Antonyms'); },
    past: function (g) { var v = pick(V);
      return it('Yesterday I ___ (' + v[0] + ').', v[1], [v[2], v[3], v[0] + 's', v[0] + 'ing'], '"' + v[0] + '" is irregular: the past tense is "' + v[1] + '".', '"' + v[0] + '" (' + v[4] + ') là động từ bất quy tắc; quá khứ là "' + v[1] + '".', 'Không thêm -ed được.', 'past', 'L.' + Math.min(g, 5) + '.1 · Irregular verbs'); },
    plural: function (g) { var p = pick(P);
      return it('What is the plural of "' + p[0] + '"?', p[1], [p[2], p[3], p[0] + 'es', p[0] + 'ies', p[0] + 'en'], 'The plural of "' + p[0] + '" is "' + p[1] + '".', 'Số nhiều của "' + p[0] + '" (' + p[4] + ') là "' + p[1] + '".', 'Danh từ này là số nhiều bất quy tắc hoặc đổi đuôi.', 'plural', 'L.4.1 · Plural nouns'); },
    affix: function (g) { var L = lvl(g), as = A.filter(function (a) { return a[4] <= L; }), a = pick(as), others = sample(as, 3, [a]).map(function (x) { return x[1]; });
      return it('In the word "' + a[2] + '", what does "' + a[0] + '" mean?', a[1], others, '"' + a[0] + '" means "' + a[1] + '", as in "' + a[2] + '".', '"' + a[0] + '" nghĩa là "' + a[3] + '", như trong từ "' + a[2] + '".', 'Nghĩ đến các từ khác có cùng phần này.', 'affix', 'L.' + g + '.4b · Greek & Latin affixes'); },
    homo: function (g) { var h = pick(H);
      return it('Choose the right word: ' + h[0], h[1], h[2], h[3], h[4], 'Đọc to cả câu với từng đáp án.', 'homo', 'L.' + Math.min(g, 8) + '.1 · Commonly confused words'); }
  };

  // Hand-written grammar & reading, by grade band.
  var HAND = {
    1: [
      ["Which sentence is written correctly?", ["My sister and I went to the park.", "Me and my sister went to the park.", "My sister and me went to the park.", "I and my sister goes to the park."], 0, "Use 'I' when you are part of the subject: 'My sister and I went'.", "Khi là chủ ngữ, dùng 'I': 'My sister and I went'.", "Bỏ 'my sister' đi rồi đọc lại.", "L.4.1 · Pronouns"],
      ["Which word is an adverb? 'The turtle walked slowly.'", ["turtle", "walked", "slowly", "the"], 2, "Adverbs describe verbs; 'slowly' tells how it walked.", "Trạng từ bổ nghĩa cho động từ; 'slowly' cho biết đi như thế nào.", "Thường kết thúc bằng -ly.", "L.4.1a · Adverbs"],
      ["Which is a complete sentence?", ["Running down the hill.", "The dog barked at the mailman.", "Because it was raining.", "After the game."], 1, "A complete sentence has a subject and a verb and a complete thought.", "Câu hoàn chỉnh cần có chủ ngữ, động từ và ý trọn vẹn.", "Ai làm gì?", "L.4.1f · Complete sentences"],
      ["Choose the correct punctuation: \"Watch out\" yelled Sam.", ["\"Watch out!\" yelled Sam.", "\"Watch out.\" yelled Sam", "Watch out! yelled Sam.", "\"Watch out\" yelled, Sam."], 0, "Put the exclamation mark inside the quotation marks.", "Dấu chấm than đặt bên trong ngoặc kép.", "Dấu câu nằm trong ngoặc kép.", "L.4.2b · Quotation marks"],
      ["What is the main idea of a paragraph?", ["The most important point", "The first word", "A small detail", "The title of the book"], 0, "The main idea is what the paragraph is mostly about.", "Ý chính là điều đoạn văn chủ yếu nói tới.", "Đoạn văn nói chủ yếu về gì?", "RI.4.2 · Main idea"],
      ["'The classroom was a zoo.' This is a…", ["metaphor", "simile", "fact", "question"], 0, "A metaphor compares without 'like' or 'as'.", "Ẩn dụ so sánh mà không dùng 'like' hay 'as'.", "Không có 'like'.", "L.5.5a · Figurative language"],
      ["'She runs like the wind.' This is a…", ["simile", "metaphor", "noun", "rhyme"], 0, "A simile compares using 'like' or 'as'.", "So sánh dùng 'like' hoặc 'as' gọi là simile.", "Có chữ 'like'.", "L.5.5a · Figurative language"],
      ["Which word is a conjunction? 'I wanted to play, but it rained.'", ["wanted", "but", "play", "rained"], 1, "Conjunctions like 'and', 'but', 'or' join ideas.", "Liên từ như 'and', 'but', 'or' nối các ý.", "FANBOYS.", "L.5.1a · Conjunctions"],
      ["Who tells the story in first-person point of view?", ["A character using 'I'", "An outside narrator using 'he'", "The reader", "Nobody"], 0, "First person uses 'I' and 'we'.", "Ngôi thứ nhất dùng 'I', 'we'.", "Người kể là 'tôi'.", "RL.4.6 · Point of view"],
      ["Which sentence uses a comma correctly?", ["I bought apples, bananas, and grapes.", "I bought, apples bananas and grapes.", "I, bought apples bananas, and grapes.", "I bought apples bananas and, grapes."], 0, "Use commas to separate items in a list.", "Dùng dấu phẩy để ngăn cách các thứ trong một danh sách.", "Liệt kê.", "L.5.2a · Commas in a series"]
    ],
    2: [
      ["Identify the subject: 'After school, the tired students walked home.'", ["school", "the tired students", "walked", "home"], 1, "The subject is who did the action: 'the tired students'.", "Chủ ngữ là ai làm hành động: 'the tired students'.", "Ai đi bộ về nhà?", "L.6.1 · Sentence parts"],
      ["Which sentence has correct pronoun agreement?", ["Every student must bring his or her book.", "Every student must bring their books to them.", "Every students must bring her book.", "Every student must bring our book."], 0, "A singular subject takes a singular pronoun in formal writing.", "Chủ ngữ số ít đi với đại từ số ít trong văn viết trang trọng.", "'Every student' là số ít.", "L.6.1c · Pronoun agreement"],
      ["'The wind whispered through the trees.' This is…", ["personification", "a simile", "alliteration", "a fact"], 0, "Giving human actions to non-human things is personification.", "Gán hành động của người cho vật là nhân hóa.", "Gió có biết thì thầm không?", "L.7.5a · Figurative language"],
      ["Which word best shows a NEGATIVE connotation?", ["stubborn", "determined", "persistent", "dedicated"], 0, "'Stubborn' sounds negative, while the others sound positive.", "'Stubborn' (bướng bỉnh) mang nghĩa tiêu cực; các từ còn lại tích cực.", "Bạn muốn được gọi bằng từ nào?", "L.7.5c · Connotation"],
      ["What is a theme of a story?", ["Its message about life", "The setting", "The main character's name", "The number of chapters"], 0, "Theme is the lesson or message the story shows.", "Chủ đề là bài học hay thông điệp của câu chuyện.", "Câu chuyện dạy ta điều gì?", "RL.6.2 · Theme"],
      ["Which is a compound sentence?", ["I studied, and I passed the test.", "I studied hard.", "Because I studied.", "Studying for the test."], 0, "A compound sentence joins two independent clauses with a conjunction.", "Câu ghép nối hai mệnh đề độc lập bằng liên từ.", "Hai câu đầy đủ nối lại.", "L.7.1b · Sentence types"],
      ["Choose the correct word: 'The team ___ winning.'", ["is", "are", "were", "be"], 0, "'Team' is a collective noun acting as one unit, so use 'is'.", "'Team' là danh từ tập hợp xem như một khối nên dùng 'is'.", "Một đội.", "L.6.1 · Subject–verb agreement"],
      ["Which source is MOST reliable for a science report?", ["A university science website", "A random social media post", "An ad for vitamins", "A friend's opinion"], 0, "Expert, well-reviewed sources are more reliable.", "Nguồn từ chuyên gia (trường đại học) đáng tin hơn.", "Ai là chuyên gia?", "W.7.8 · Research sources"],
      ["What does 'foreshadowing' do in a story?", ["Hints at what will happen later", "Describes the setting", "Ends the story", "Lists characters"], 0, "Foreshadowing gives clues about future events.", "Điềm báo (foreshadowing) gợi ý trước những gì sắp xảy ra.", "Fore- = trước.", "RL.7.3 · Plot"],
      ["Which uses a semicolon correctly?", ["I love math; it is my best subject.", "I love; math it is my best subject.", "I love math it; is my best subject.", "I; love math."], 0, "A semicolon joins two closely related complete sentences.", "Dấu chấm phẩy nối hai câu hoàn chỉnh có liên quan chặt chẽ.", "Hai bên đều là câu đầy đủ.", "L.7.2 · Punctuation"]
    ],
    3: [
      ["Which sentence is in the passive voice?", ["The cake was eaten by the kids.", "The kids ate the cake.", "The kids are eating.", "Eat the cake!"], 0, "Passive voice: the subject receives the action ('was eaten by').", "Câu bị động: chủ ngữ nhận hành động ('was eaten by').", "Có 'was … by'.", "L.8.1b · Active & passive voice"],
      ["Which word is a gerund? 'Swimming is good exercise.'", ["Swimming", "is", "good", "exercise"], 0, "A gerund is a verb + -ing used as a noun.", "Danh động từ là động từ thêm -ing dùng như danh từ.", "Động từ làm chủ ngữ.", "L.8.1a · Verbals"],
      ["'I could have went' should be…", ["I could have gone", "I could of went", "I could have go", "I could gone"], 0, "After 'have', use the past participle 'gone'.", "Sau 'have' dùng quá khứ phân từ 'gone'.", "go – went – gone.", "L.8.1 · Verb forms"],
      ["Irony is when…", ["the opposite of what is expected happens", "two words rhyme", "a story has a happy ending", "the author explains the theme"], 0, "Irony is a contrast between what is expected and what actually happens.", "Châm biếm/trớ trêu là khi điều xảy ra ngược với điều được mong đợi.", "Trạm cứu hỏa bị cháy.", "RL.8.6 · Irony"],
      ["An author's 'claim' in an argument is…", ["the main position they argue for", "a random fact", "a counterargument", "the title"], 0, "A claim is the main point the writer wants you to accept.", "Luận điểm là quan điểm chính tác giả muốn người đọc đồng ý.", "Tác giả muốn thuyết phục điều gì?", "RI.9-10.8 · Argument"],
      ["Which is an example of 'ethos'?", ["As a doctor for 20 years, I recommend…", "Imagine how sad the puppies feel…", "Studies show 80% of people…", "Buy now!"], 0, "Ethos appeals to the speaker's credibility.", "Ethos thuyết phục bằng uy tín của người nói.", "Uy tín, chuyên môn.", "RI.9-10.6 · Rhetoric"],
      ["Which is an example of 'pathos'?", ["Think of the hungry children who need your help.", "I am an expert.", "The data proves it.", "In conclusion."], 0, "Pathos appeals to emotions.", "Pathos thuyết phục bằng cảm xúc.", "Cảm xúc.", "RI.9-10.6 · Rhetoric"],
      ["Choose the correct sentence.", ["Neither the teacher nor the students were late.", "Neither the teacher nor the students was late.", "Neither the teacher or the students were late.", "Neither teacher nor the students is late."], 0, "With 'neither…nor', the verb agrees with the closer subject ('students' → were).", "Với 'neither…nor', động từ chia theo chủ ngữ gần nhất ('students' → were).", "Chủ ngữ gần động từ nhất.", "L.9-10.1 · Agreement"],
      ["A 'dangling modifier' is shown in…", ["Walking home, the rain soaked me.", "Walking home, I got soaked by the rain.", "I walked home in the rain.", "The rain soaked me as I walked."], 0, "It sounds like the rain was walking home — the modifier has no clear subject.", "Câu nghe như cơn mưa đang đi bộ về nhà: cụm bổ nghĩa bị 'treo'.", "Ai đang đi bộ?", "L.9-10.1 · Modifiers"],
      ["What is a 'thesis statement'?", ["One sentence that states the main argument of an essay", "The last word of an essay", "A list of sources", "A question for the reader"], 0, "The thesis states the essay's central claim, usually in the introduction.", "Câu luận đề nêu ý chính của bài luận, thường nằm ở mở bài.", "Thường ở cuối đoạn mở bài.", "W.9-10.1 · Writing"]
    ]
  };

  var TYPES = ['syn', 'ant', 'past', 'plural', 'affix', 'homo'];
  function typesFor(g) { return g >= 8 ? ['syn', 'ant', 'affix', 'homo'] : TYPES; }
  function generate(grade, n, weightOf) {
    var ts = typesFor(grade), w = ts.map(function (t) { return 1 + (weightOf ? weightOf(t) : 0); }), total = w.reduce(function (a, b) { return a + b; }, 0), out = [], guard = 0;
    while (out.length < n && guard++ < n * 10) {
      var r = Math.random() * total, i = 0; while (r > w[i]) { r -= w[i]; i++; }
      var x = T[ts[Math.min(i, ts.length - 1)]](grade); if (new Set(x[1]).size === 4) out.push(x);
    }
    return out;
  }
  // Hand-written items go into the bank under world "english".
  var B = window.QUEST_BANK = window.QUEST_BANK || {};
  for (var g = 4; g <= 10; g++) { B[g] = B[g] || {}; B[g].english = (B[g].english || []).concat(HAND[lvl(g)]); }
  window.ANDY_GEN_ENGLISH = { generate: generate, types: typesFor, _T: T };
})();
