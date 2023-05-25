const { Client, MessageMedia, LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const admin = require('firebase-admin');
const axios = require('axios');
const serviceAccount = require('./etmc-whatsapp-bot.json');
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://etmc-whatsapp-bot-default-rtdb.asia-southeast1.firebasedatabase.app'
});
const db = admin.database();
const refCht = db.ref('dataPengguna/Dbcht');
const pointRef = db.ref('dataPengguna/pengguna')
const point = {};

client.on('message', async (message) => {
    const sA = message.author;
    const sender = message.from;
    const corection = sA != undefined ? sA : sender;
    const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
    const pesan = message.body.toLocaleLowerCase();
    const kataKasar =[
        'kontol',
        'kuntul',
        'kintil',
        'itil',
        'kntl',
        'blog',
        'gblk',
        'goblog',
        'goblok',
        'anjg',
        'anj',
        'anjing',
        'bajingan',
        'ngentot',
        'jingan',
        'jing',
        'ngntot',
        'anjir',
        'kimak',
        'puki',
        'meki',
        'pantek',
        'memek',
        'mmk',
        'bangsat',
        'bgst',
        'pler',
        'dito',
        '3gp',
        '3some',
        '4some',
        '*damn',
        '*dyke',
        '*fuck*',
        '*shit*',
        '@$$',
        'adult',
        'ahole',
        'akka',
        'amcik',
        'anal-play',
        'analingus',
        'analplay',
        'androsodomy',
        'andskota',
        'anilingus',
        'anjing',
        'anjrit',
        'anjrot',
        'anus',
        'arschloch',
        'arse',
        'arse*',
        'arsehole',
        'ash0le',
        'ash0les',
        'asholes',
        'ass monkey',
        'ass-playauto-eroticism',
        'asses',
        'assface',
        'assh0le',
        'assh0lez',
        'asshole',
        'asshole',
        'assholes',
        'assholz',
        'asslick',
        'assplay',
        'assrammer',
        'asswipe',
        'ashu',
        'washu',
        'wasu',
        'wasuh',
        'autofellatio',
        'autopederasty',
        'ayir',
        'azzhole',
        'badass',
        'b00b',
        'b00b*',
        'b00bs',
        'b1tch',
        'b17ch',
        'b!+ch',
        'b!tch',
        'babami',
        'babes',
        'bego',
        'babi',
        'bagudung',
        'bajingan',
        'ball-gag',
        'ballgag',
        'banci',
        'bangla',
        'bangsat',
        'bareback',
        'barebacking',
        'bassterds',
        'bastard',
        'bastards',
        'bastardz',
        'basterds',
        'basterdz',
        'bacot',
        'bloon',
        'bdsm',
        'beastilaity',
        'bejad',
        'bejat',
        'bencong',
        'bestiality',
        'bi7ch',
        'bi+ch',
        'biatch',
        'bikini',
        'birahi',
        'bitch',
        'bitch',
        'bitch*',
        'bitches',
        'blow job',
        'blow-job',
        'blowjob',
        'blowjob',
        'blowjobs',
        'bodat',
        'boffing',
        'bogel',
        'boiolas',
        'bokep',
        'bollock',
        'bollock*',
        'bondage',
        'boner',
        'boob',
        'boobies',
        'boobs',
        'borjong',
        'breas',
        'breasts',
        'brengsek',
        'buceta',
        'bugger',
        'buggery',
        'bugil',
        'bukake',
        'bukakke',
        'bull-dyke',
        'bull-dykes',
        'bulldyke',
        'bulldykes',
        'bungul',
        'burit',
        'butt',
        'butt-pirate',
        'butt-plug',
        'butt-plugs',
        'butthole',
        'buttplug',
        'buttplugs',
        'butts',
        'buttwipe',
        'c0ck',
        'c0cks',
        'c0k',
        'cabron',
        'cameltoe',
        'cameltoes',
        'carpet muncher',
        'cawk',
        'cawks',
        'cazzo',
        'cerita dewasa',
        'cerita hot',
        'cerita panas',
        'cerita seru',
        'chick',
        'chicks',
        'chink',
        'choda',
        'chraa',
        'chudai',
        'chuj',
        'cipa',
        'cipki',
        'clit',
        'clit',
        'clitoris',
        'clits',
        'cnts',
        'cntz',
        'cock',
        'cock*',
        'cock-head',
        'cock-sucker',
        'cockhead',
        'cocks',
        'cocksucker',
        'coli',
        'coprophagy',
        'coprophilia',
        'cornhole',
        'cornholes',
        'corpophilia',
        'corpophilic',
        'crack',
        'crackz',
        'crap',
        'cream-pie',
        'creampie',
        'creamypie',
        'cum',
        'cumming',
        'cumpic',
        'cumshot',
        'cumshots',
        'cunilingus',
        'cunnilingus',
        'cunt',
        'cunt*',
        'cunts',
        'cuntz',
        'cukimay',
        'cukimai',
        'd4mn',
        'damn',
        'dancuk',
        'daniel brou',
        'david neil wallace',
        'daygo',
        'deepthroat',
        'defecated',
        'defecating',
        'defecation',
        'dego',
        'desnuda',
        'dick',
        'dick',
        'dick*',
        'dicks',
        'dike',
        'dike*',
        'dild0',
        'dild0s',
        'dildo',
        'dildoes',
        'dildos',
        'dilld0',
        'dilld0s',
        'dirsa',
        'dnwallace',
        'doggystyle',
        'dominatricks',
        'dominatrics',
        'dominatrix',
        'douche',
        'douches',
        'douching',
        'dupa',
        'dyke',
        'dykes',
        'dziwka',
        'ejackulate',
        'ejakulate',
        'ekrem',
        'ekrem*',
        'ekto',
        'ekto',
        'enculer',
        'enema',
        'enemas',
        'erection',
        'erections',
        'erotic',
        'erotica',
        'f u c k',
        'f u c k e r',
        'facesit',
        'facesitting',
        'facial',
        'facials',
        'faen',
        'fag',
        'fag1t',
        'fag*',
        'faget',
        'fagg0t',
        'fagg1t',
        'faggit',
        'faggot',
        'fagit',
        'fags',
        'fagz',
        'faig',
        'faigs',
        'fanculo',
        'fanny',
        'fart',
        'farted',
        'farting',
        'fatass',
        'fcuk',
        'feces',
        'feg',
        'felch',
        'felcher',
        'felcher',
        'felching',
        'fellatio',
        'fetish',
        'fetishes',
        'ficken',
        'fisting',
        'fitt*',
        'flikker',
        'flikker',
        'flipping the bird',
        'footjob',
        'foreskin',
        'fotze',
        'fotze',
        'foursome',
        'fu(*',
        'fuck',
        'fuck',
        'fucker',
        'fuckin',
        'fucking',
        'fucking',
        'fucks',
        'fudge packer',
        'fuk',
        'fuk*',
        'fukah',
        'fuken',
        'fuker',
        'fukin',
        'fukk',
        'fukkah',
        'fukken',
        'fukker',
        'fukkin',
        'futkretzn',
        'fux0r',
        'g00k',
        'g-spot',
        'gag',
        'gang-bang',
        'gangbang',
        'gay',
        'gayboy',
        'gaygirl',
        'gays',
        'gayz',
        'gembel',
        'genital',
        'genitalia',
        'genitals',
        'gila',
        'gigolo',
        'goblok',
        'girl',
        'glory-hole',
        'glory-holes',
        'gloryhole',
        'gloryholes',
        'god-damned',
        'gook',
        'groupsex',
        'gspot',
        'guiena',
        'h0ar',
        'h0r',
        'h0re',
        'h00r',
        'h4x0r',
        'hand-job',
        'handjob',
        'hardcore',
        'hate',
        'heang',
        'hell',
        'hells',
        'helvete',
        'hencet',
        'henceut',
        'hentai',
        'hitler',
        'hoar',
        'hoer',
        'hoer*',
        'homosexual',
        'honkey',
        'hoor',
        'hoore',
        'hore',
        'horny',
        'hot girl',
        'hot video',
        'hubungan intim',
        'huevon',
        'huevon',
        'hui',
        'idiot',
        'incest',
        'injun',
        'intercourse',
        'interracial',
        'itil',
        'jablay',
        'jablai',
        'jackass',
        'jackoff',
        'jancuk',
        'jancok',
        'j4ncok',
        'jap',
        'japs',
        'jebanje',
        'jembut',
        'jerk-off',
        'jisim',
        'jism',
        'jiss',
        'jizm',
        'jizz',
        'joanne yiokaris',
        'kacuk',
        'kampang',
        'kampret',
        'kanciang',
        'kanjut',
        'kancut',
        'kanker*',
        'kankerkinky',
        'kawk',
        'kelamin',
        'kelentit',
        'keparat',
        'kike',
        'kimak',
        'klimak',
        'klimax',
        'klitoris',
        'klootzak',
        'knob',
        'knobs',
        'knobz',
        'knulle',
        'kolop',
        'kontol',
        'kontol',
        'kraut',
        'kripalu',
        'kuk',
        'kuksuger',
        'kunt',
        'kunts',
        'kuntz',
        'kunyuk',
        'kurac',
        'kurac',
        'kurwa',
        'kusi',
        'kusi*',
        'kyrpa',
        'kyrpa*',
        'l3i+ch',
        'l3itch',
        'labia',
        'labial',
        'lancap',
        'lau xanh',
        'lesbi',
        'lesbian',
        'lesbians',
        'lesbo',
        'lezzian',
        'lipshits',
        'lipshitz',
        'lolita',
        'lolitas',
        'lonte',
        'lucah',
        'maho',
        'matamu',
        'malam pengantin',
        'malam pertama',
        'mamhoon',
        'maria ozawa',
        'masochism',
        'masochist',
        'masochistic',
        'masokist',
        'massterbait',
        'masstrbait',
        'masstrbate',
        'masterbaiter',
        'masterbat3',
        'masterbat*',
        'masterbate',
        'masterbates',
        'masturbat',
        'masturbat*',
        'masturbate',
        'masturbation',
        'memek',
        'memek',
        'merd*',
        'mesum',
        'mibun',
        'mofo',
        'monkleigh',
        'motha fucker',
        'motha fuker',
        'motha fukkah',
        'motha fukker',
        'mother fucker',
        'mother fukah',
        'mother fuker',
        'mother fukkah',
        'mother fukker',
        'mother-fucker',
        'motherfisher',
        'motherfucker',
        'mouliewop',
        'muff',
        'muie',
        'mujeres',
        'mulkku',
        'muschi',
        'mutha fucker',
        'mutha fukah',
        'mutha fuker',
        'mutha fukkah',
        'mutha fukker',
        'n1gr',
        'naked',
        'nastt',
        'nazi',
        'nazis',
        'necrophilia',
        'nenen',
        'nepesaurio',
        'ngecrot',
        'ngegay',
        'ngentot',
        'ngentot',
        'ngewe',
        'ngocok',
        'ngulum',
        'nigga',
        'nigger',
        'nigger*',
        'nigger;',
        'niggers',
        'nigur;',
        'niiger;',
        'niigr;',
        'nipple',
        'nipples',
        'no cd',
        'nocd',
        'nude',
        'nudes',
        'nudity',
        'nutsack',
        'nympho',
        'nymphomania',
        'nymphomaniac',
        'orafis',
        'orgasim;',
        'orgasm',
        'orgasms',
        'orgasum',
        'orgies',
        'orgy',
        'oriface',
        'orifice',
        'orifiss',
        'orospu',
        'p0rn',
        'packi',
        'packie',
        'packy',
        'paki',
        'pakie',
        'paky',
        'pantat',
        'pantek',
        'paska',
        'paska*',
        'pecker',
        'pecun',
        'pederast',
        'pederasty',
        'pedophilia',
        'pedophiliac',
        'pee',
        'peeenus',
        'peeenusss',
        'peeing',
        'peenus',
        'peinus',
        'pemerkosaan',
        'pen1s',
        'penas',
        'penetration',
        'penetrations',
        'penis',
        'penis',
        'penis-breath',
        'pentil',
        'penus',
        'penuus',
        'pepek',
        'perek',
        'perse',
        'pervert',
        'perverted',
        'perverts',
        'pg ishazamuddin',
        'phuc',
        'phuck',
        'phuck',
        'phuk',
        'phuker',
        'phukker',
        'picka',
        'pierdol',
        'pierdol*',
        'pilat',
        'pillu',
        'pillu*',
        'pimmel',
        'pimpis',
        'piss',
        'piss*',
        'pizda',
        'polac',
        'polack',
        'polak',
        'poonani',
        'poontsee',
        'poop',
        'porn',
        'pr0n',
        'pr1c',
        'pr1ck',
        'pr1k',
        'precum',
        'preteen',
        'prick',
        'pricks',
        'prostitute',
        'prostituted',
        'prostitutes',
        'prostituting',
        'puki',
        'pukimak',
        'pula',
        'pule',
        'pusse',
        'pussee',
        'pussies',
        'pussy',
        'pussy',
        'pussylips',
        'pussys',
        'puta',
        'puto',
        'puuke',
        'puuker',
        'qahbeh',
        'queef',
        'queef*',
        'queer',
        'queers',
        'queerz',
        'qweef',
        'qweers',
        'qweerz',
        'qweir',
        'racist',
        'rape',
        'raped',
        'rapes',
        'rapist',
        'rautenberg',
        'recktum',
        'rectum',
        'retard',
        'rimjob',
        's.o.b.',
        'sabul',
        'sadism',
        'sadist',
        'sarap',
        'scank',
        'scat',
        'schaffer',
        'scheiss',
        'scheiss*',
        'schlampe',
        'schlong',
        'schmuck',
        'school',
        'screw',
        'screwing',
        'scrotum',
        'sekolah menengah shan tao',
        'seks',
        'semen',
        'sempak',
        'senggama',
        'sepong',
        'setan',
        'setubuh',
        'sex',
        'sexy',
        'sh1t',
        'sh1ter',
        'sh1ts',
        'sh1tter',
        'sh1tz',
        'sh!+',
        'sh!t',
        'sh!t',
        'sh!t*',
        'sharmuta',
        'sharmute',
        'shemale',
        'shi+',
        'shipal',
        'shit',
        'shits',
        'shitter',
        'shitty',
        'shity',
        'shitz',
        'shiz',
        'shyt',
        'shyte',
        'shytty',
        'shyty',
        'silit',
        'sinting',
        'sixty-nine',
        'sixtynine',
        'skanck',
        'skank',
        'skankee',
        'skankey',
        'skanks',
        'skanky',
        'skribz',
        'skurwysyn',
        'slag',
        'slut',
        'sluts',
        'slutty',
        'slutty',
        'slutz',
        'smut',
        'sodomi',
        'sodomize',
        'sodomy',
        'softcore',
        'son-of-a-bitch',
        'spank',
        'spanked',
        'spanking',
        'sperm',
        'sphencter',
        'spic',
        'spierdalaj',
        'splooge',
        'squirt',
        'squirted',
        'squirting',
        'strap-on',
        'strapon',
        'submissive',
        'suck',
        'suck-off',
        'sucked',
        'sucking',
        'sucks',
        'suicide',
        'suka',
        'taek',
        'tanpa busana',
        'taptei',
        'teets',
        'teez',
        'teho',
        'telanjang',
        'testical',
        'testicle',
        'testicle*',
        'testicles',
        'tetek',
        'tetek',
        'threesome',
        'tit',
        'titit',
        'tits',
        'titt',
        'titt*',
        'titties',
        'titty',
        'tittys',
        'toket',
        'tolol',
        'topless',
        'totong',
        'tranny',
        'transsexual',
        'transvestite',
        'tukar istri',
        'tukar pasangan',
        'turd',
        'tusbol',
        'twat',
        'twats',
        'twaty',
        'twink',
        'upskirt',
        'urinated',
        'urinating',
        'urination',
        'va1jina',
        'vag1na',
        'vagiina',
        'vagina',
        'vagina',
        'vaginas',
        'vaj1na',
        'vajina',
        'vibrator',
        'vittu',
        'vullva',
        'vulva',
        'w0p',
        'w00se',
        'wank',
        'wank*',
        'wanking',
        'warez',
        'watersports',
        'wetback*',
        'wh0re',
        'wh00r',
        'whoar',
        'whore',
        'whores',
        'wichser',
        'wop*',
        'wtf',
        'x-girl',
        'x-rated',
        'xes',
        'xrated',
        'xxx',
        'yed',
        'zabourah',
        'bangke',
    
    ];  
    
    //pesan balasan
    if(kataKasar.some(kataKasar => pesan.includes(kataKasar))){
        const rep = [
            'dih toxic',
                'heh gaboleh toxic',
                'ssssttt jangan toxic',
                'siapa yg ngajarin ngomong gitu',
                'heh saru',
                'eitss ngomong apa tadi?',
                'jangan gitu yaa, banyak anak kecil',
                'woy jangan aneh-aneh',
                'cukup sopan dong',
                'ingat aturan grup, jangan toxic',
                'tidak ada toleransi untuk bahasa kasar',
                'tolong jaga bahasa ya',
                'hati-hati menggunakan kata-kata',
                'bicara dengan sopan ya',
                'jaga etika dalam berbicara',
                'tenang, kita bisa bicara dengan baik',
                'yuk jaga suasana yang positif',
                'tidak perlu pake kata-kata kasar',
                'ada masalah? kita bisa bicarakan dengan baik',
                'ingat, perkataan kita mencerminkan diri kita',
                'sopan santun tetap penting',
                'kita semua butuh saling menghormati',
                'bicara yang baik akan membangun hubungan yang lebih baik',
                'ajak diskusi dengan cara yang baik dan sopan',
                'tolong hindari kata-kata yang merugikan orang lain',
                'kita bisa saling menghargai pendapat tanpa menggunakan kata kasar',
                'hindari menghakimi dengan kata-kata yang tidak pantas',
                'berbicara dengan baik adalah tanda kedewasaan',
                'ingat, kita berteman dan berinteraksi dengan baik',
                'bicara yang baik akan memberikan dampak positif',
                'yuk, kita ciptakan lingkungan yang nyaman untuk berbicara'
        ];
        const capitalizedRep = rep.map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1));
        const reprep = capitalizedRep[Math.floor(Math.random() * capitalizedRep.length)] 
        message.reply(reprep)
    }

    if(
        pesan.match(/\bkon\b/i) ||
        pesan.match(/\btot\b/i) ||
        pesan.match(/\bngen\b/i) ||
        pesan.match(/\bsu\b/i) ||
        pesan.match(/\basu\b/i) ||
        pesan.match(/\bler\b/i) ||
        pesan.match(/\btai\b/i) ||
        pesan.match(/\bcok\b/i) ||
        pesan.match(/\bcuk\b/i) ||
        pesan.match(/\bass\b/i) ||
        pesan.match(/\banal\b/i) ||
        pesan.match(/\btod\b/i) 
        ){
            const rep = [
                'dih toxic',
                'heh gaboleh toxic',
                'ssssttt jangan toxic',
                'siapa yg ngajarin ngomong gitu',
                'heh saru',
                'eitss ngomong apa tadi?',
                'jangan gitu yaa, banyak anak kecil',
                'woy jangan aneh-aneh',
                'cukup sopan dong',
                'ingat aturan grup, jangan toxic',
                'tidak ada toleransi untuk bahasa kasar',
                'tolong jaga bahasa ya',
                'hati-hati menggunakan kata-kata',
                'bicara dengan sopan ya',
                'jaga etika dalam berbicara',
                'tenang, kita bisa bicara dengan baik',
                'yuk jaga suasana yang positif',
                'tidak perlu pake kata-kata kasar',
                'ada masalah? kita bisa bicarakan dengan baik',
                'ingat, perkataan kita mencerminkan diri kita',
                'sopan santun tetap penting',
                'kita semua butuh saling menghormati',
                'bicara yang baik akan membangun hubungan yang lebih baik',
                'ajak diskusi dengan cara yang baik dan sopan',
                'tolong hindari kata-kata yang merugikan orang lain',
                'kita bisa saling menghargai pendapat tanpa menggunakan kata kasar',
                'hindari menghakimi dengan kata-kata yang tidak pantas',
                'berbicara dengan baik adalah tanda kedewasaan',
                'ingat, kita berteman dan berinteraksi dengan baik',
                'bicara yang baik akan memberikan dampak positif',
                'yuk, kita ciptakan lingkungan yang nyaman untuk berbicara'
            ];
            const capitalizedRep = rep.map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1));
            const reprep = capitalizedRep[Math.floor(Math.random() * capitalizedRep.length)] 
            message.reply(reprep)
    }

    if(pesan.includes('bacot') || pesan.includes('bct')){
        message.reply('sssshhh gaboleh gitu')
            setTimeout(() =>{
                message.reply('BACOT NIGGA')
            }, 3500)
    }

    if(pesan.match(/\bpi\b/i) || pesan.match(/\bfi\b/i) || pesan.match(/\braf\b/i) || pesan.match(/\brap\b/i) || pesan.match(/\brapi\b/i) || pesan.match(/\brafi\b/i)){
        message.reply("apa? bentar");
        const rep = [
            "Si rapi nya lagi sibuk ni",
            "Si rapi nya lagi ribet yaa",
            "Tunggu bentar ya, si rapinya gatau kemana",
            "Si rapi lagi pergi ke pasar",
            "Si rapi lagi makan siang",
            "Si rapi lagi tidur",
            "Si rapi sedang rapat",
            "Si rapi lagi meeting",
            "Si rapi sedang nonton film",
            "Si rapi lagi olahraga",
            "Si rapi sedang belajar",
            "Si rapi lagi ngobrol sama teman",
        ];
            setTimeout(() =>{
                const reprep = rep[Math.floor(Math.random() * rep.length)] 
                message.reply(reprep)
            }, 2500);
    }


    if(pesan.match(/\boke\b/i) ||
        pesan.match(/\bok\b/i) ||
        pesan.match(/\bk\b/i)
        ){
        message.reply('Oke Oke doang ngerti ga?');
    }

    if(pesan.match(/\bmabar\b/i)){    
        message.reply('mabar apa nich?');
        const repMbr = [
            'Wait',
            'Bentar atuh',
            'Belom install',
        ]
                setTimeout(() => {
                    const repMabar = repMbr[Math.floor(Math.random() * repMbr.length)] 
                    message.reply(repMabar)
                }, 3000)
            
    }


    //Command

    
    if (pesan === '!bot') {
        const commands = [
          { p: '!help', label: 'Bantuan' },
          { p: '!rules', label: 'Aturan' },
          { p: '!berita', label: 'Berita Terkini' },
          { p: '!cuaca', label: 'Info Cuaca' },
          { p: '!doa', label: 'Doa Harian' },
          { p: '!quotes', label: 'Apa Quotes Untuk mu?' },
          { p: '!point', label: 'Cek Point' },
          { p: '!point', label: 'Cek Point' },
          { p: '!togel', label: 'Main Togel' },
          { p: '!slot', label: 'Main Slot' }
        ];
        
        let menuText = '*ETMC-BOT nih boss* \n\n';
        
        commands.forEach((command, index) => {
            menuText += `${index + 1}. ${command.p} - ${command.label}\n`;
        });
        
        menuText += '\nBaru ada Command Ini Doang ni';
        message.reply(menuText);
    }
    
    if(pesan === '!help'){
        message.reply('!togel = main togel kalo JP dapet 5000 Point tapi lu bayar 1.000 Point\n!slot = main slot kalo JP dapet 5000 tapi lu bayar 500\n!berita = info berita terkini dari CNN, di pick secara random\n\nMADE by : ETMC \nMAINTENANCE by: W0lV')
    }
    
    if(pesan === '!rules'){
        message.reply(`Toxic! \nSara \nBoleh main slot \naturan dibuat untuk di langgar`)
    }
    
    if (pesan === '!berita') {
        axios.get(`https://api-berita-indonesia.vercel.app/cnn/terbaru/`)
        .then(response => {
            const resp = response.data;
            const posts = resp.data.posts.slice();
            const randomIndex = Math.floor(Math.random() * posts.length);
            const randomData = posts[randomIndex];
            const timestamp = randomData.pubDate;
            const date = new Date(timestamp);
            const hours = date.getUTCHours().toString().padStart(2, "0");
            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
            const day = date.getUTCDate().toString().padStart(2, "0");
            const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Ditambah 1 karena indeks bulan dimulai dari 0
            const year = date.getUTCFullYear();
            const formattedDate = `${hours}:${minutes}, ${day}/${month}/${year}`;
            message.reply(`*${randomData.title}* \nTanggal: ${formattedDate}. \n\n${randomData.description} \n\nBacaSelengkapnya : ${randomData.link} `);
        })
        .catch(error => {
            console.log(error);
        });
    }
    if (pesan === '!cuaca') {
        axios.get('https://ibnux.github.io/BMKG-importer/cuaca/5002227.json').then(resp => {
          const dataCuaca = resp.data;
          const waktuSekarang = new Date();
          const dataCuacaTerdekat = dataCuaca.find(data => {
            const waktuData = new Date(data.jamCuaca);
            return waktuData > waktuSekarang;
          });
          if (dataCuacaTerdekat) {
            const balasan = `Cuaca terdekat:\nJam: ${dataCuacaTerdekat.jamCuaca}\nCuaca: ${dataCuacaTerdekat.cuaca}\nSuhu: ${dataCuacaTerdekat.tempC}°C`;
            message.reply(balasan);
        } else {
            const balasan = 'Maaf, tidak ada data cuaca yang tersedia untuk waktu mendatang.';
            message.reply(balasan);
          }
        });
      }
    
    if(pesan === '!doa'){
        axios.get(`https://doa-doa-api-ahmadramadhan.fly.dev/api`).then(resp => {
            const dataDoa = resp.data.slice();
            const randomIndex = Math.floor(Math.random() * dataDoa.length);
            const randomData = dataDoa[randomIndex];
            const balasan = `${randomData.doa}\n\n${randomData.ayat}\n${randomData.latin}\n\nArtinya: ${randomData.artinya}`
            message.reply(balasan);
        })
    }

    //search engine
    const regexCari = /^!cari\s(.+)/;
    const cocok = pesan.match(regexCari);
    
    if (cocok) {
      const kataKunci = cocok[1].trim();
      axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${kataKunci}`)
        .then((resp) => {
          const pencarian = resp.data.extract;
          const jumlahKata = 20;
          const hasil = pencarian.split(" ");
          const kataPotong = hasil.slice(0, jumlahKata);
          const balasan = kataPotong.join(" ");
    
          if (pencarian) {
            message.reply(balasan);
          } else {
            message.reply('kaga ada itu mah, yg laen aja coba');
          }
        })
        .catch((error) => {
          message.reply('nyari apaan si?');
        });
    } else {
      console.log(`err`);
    }



    if (pesan === "!quotes") {
        axios.get("https://kyoko.rei.my.id/api/quotes.php").then((resp) => {
          const quotes = resp.data.apiResult;
          if (quotes.length > 0) {
            const balasan = `'${quotes[0].indo}'\n\n"${quotes[0].character}"`;
            message.reply(balasan);
          } else {
            message.reply("tidak ada quotes buat lu.");
          }
        });
      }
      
      if(pesan === '!hentai'){
        await axios.get(`https://kyoko.rei.my.id/api/nsfw.php`).then((resp) => {
            const gambarURL =  resp.data.apiResult.url[0];
            if(gambarURL.length > 0){
                    message.reply('sabar yaa, proses ni.')
                setTimeout(async () => {
                    client.sendMessage(message.from, await MessageMedia.fromUrl(gambarURL));
                });
            }else{
                console.log('gagal memuat konten');
            }
            }).catch((err) => {
            console.log(err)
        })
      }
    
    //point system
    if(!point[corection]){
        point[corection] = 0;
    }
    const thresholds = [0, 100 ,200, 500, 1000, 5000, 10000, 20000, 500000, 1000000, 1000000000];
    for (const threshold of thresholds) {
        if (point[corection] >= threshold) {
            const pointAdded = pointRef.child(sanitizedSender);
            pointAdded.once('value', (snapshot) => {
                const poin = snapshot.val() || 0;
                const newPoint = poin + 100;
                pointRef.child(sanitizedSender).set(newPoint);
            });
            break;
        }
    }
    
if (pesan === '!point') {
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
        const originalSender = sanitizedSender.replace(/_/g, ".");
        const poinRef = pointRef.child(sanitizedSender);

        poinRef.once('value', (snapshot) => {
            const poin = snapshot.val() || 0;
            const senderName = originalSender;
            if(senderName === originalSender){
                message.reply(`Point Kamu Tersisa: ${poin.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`);
            }else{
                    message.reply(`err`)
                }
        });
}
    
if (pesan === "!ping") {
    const pingTimestamp = new Date().getTime();
        
        if (pingTimestamp) {
        const selisihWaktu = new Date().getTime() - pingTimestamp;
        const selisihWaktuDuaAngkaDepan = (selisihWaktu / 1000).toFixed(2);
        const balasan = `Pong! : ${selisihWaktuDuaAngkaDepan}ms`;
          message.reply(`${balasan}`);
        } else {
            const balasan = "Pesan 'ping' sebelumnya tidak ditemukan.";
            message.reply(`${balasan}`);
        }

  }



    //game Togel
if (pesan === '!togel') {
        let isPasang = false;
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
        const originalSender = sanitizedSender.replace(/_/g, ".");
        const poinRef = pointRef.child(sanitizedSender);
        poinRef.once('value', async (snapshot) => {
            const poin = snapshot.val() || 0;
            const senderName = originalSender;
            if(senderName === originalSender){
                        if (poin >= 1000) {
                            message.reply('Mau masang angka berapa?');
                            const parameter1 = await new Promise((resolve) => {
                            const timeout = setTimeout(() => {
                                message.reply('Buru di isi cuk, lama pisannnn');
                                resolve('');
                            }, 1000);
                                client.on('message', (msg) => {
                                    if (msg.author === corection) {
                                    clearTimeout(timeout);
                                    resolve(msg.body);
                                }
                            });
                        });
                            const parameter = await new Promise((resolve) =>{
                                client.on('message', (msg) =>{
                                    if(msg.author === corection){
                                        resolve(msg.body)
                                    }
                                });
                            });

                            if(parameter && parameter.match(/(\d{4})/)){
                                isPasang = true;
                            }else{
                                message.reply('Masang 4 Angka dulu boss')
                            }
                                if (isPasang) {
                                        const angkaTogel = parameter;
                                        const bayarTogel = poin - 1000;
                                        pointRef.child(sanitizedSender).set(bayarTogel);
                                        message.reply(`${sanitizedSender} Berhasil Masang Togel 1000. Angkanya: ${angkaTogel}. Hasil 10 Detik doang`);
                                        setTimeout(() => {
                                            const hasil = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                                            if (hasil === angkaTogel || angkaTogel === '1111') {
                                                const menangTogel = poin + 50000;
                                                pointRef.child(sanitizedSender).set(menangTogel);
                                                message.reply(`Togel ETMC: ${hasil}. Boss Masang: ${angkaTogel}`);
                                                setTimeout(() => {
                                                    message.reply(`Mantap Boss, dapet JP 50.000.`);
                                                }, 1000);
                                            } else {
                                                message.reply(`Togel ETMC: ${hasil}. Togel Boss ${sA}: ${angkaTogel}`);
                                                setTimeout(() => {
                                                    const repmaaf = [
                                                        'sori boss belom tembus wkwk',
                                                        'maaf ni belom tembus boss',
                                                        'kurang beruntung boss coba lagi dah pake 1111',
                                                        'maaf ya, belum ada keberuntungan kali ini',
                                                        'mohon maaf, belum berhasil kali ini',
                                                        'maaf boss, belum mendapatkan hasil yang diinginkan',
                                                        'terima kasih atas kesabaran boss, masih belum beruntung',
                                                        'jangan putus asa boss, semoga keberuntungan menyertai',
                                                        'maafkan kami boss, belum bisa memberikan yang diharapkan',
                                                        'belum berhasil boss, tetap semangat dan coba lagi',
                                                        'maaf ya boss, belum ada rezeki kali ini',
                                                        'tolong maafkan kegagalan ini boss',
                                                        'maaf atas ketidakberuntungan ini boss',
                                                        'semoga keberuntungan datang di lain waktu boss',
                                                        'mohon maaf atas hasil yang belum memuaskan boss',
                                                        'sabar ya boss, masih ada kesempatan lainnya',
                                                        'maaf boss, masih belum berjodoh dengan kemenangan',
                                                        'tolong dimaklumi boss, masih dalam perjuangan mencari keberuntungan',
                                                        'semangat boss, kita belum menyerah',
                                                        'maaf atas ketidakberhasilan ini boss, tetap optimis',
                                                      ];
                                                    const capitalizedRep = repmaaf.map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1));
                                                    const reprep1 = capitalizedRep[Math.floor(Math.random() * capitalizedRep.length)] 
                                                    message.reply(reprep1);
                                                }, 1000);
                                            }
                                        }, 10000);
                                }
                        } else {
                            message.reply('Point masih dikit aja, gaya gayaan maen togel cuak');
                        }
            }else{
                    message.reply(`err`)
                }
        });
    }
    
    //gameSlot
    if (pesan === '!slot') {
        const sanitizedSender = corection.replace(/[\.\@\[\]\#\$]/g, "_");
        const originalSender = sanitizedSender.replace(/_/g, ".");
        const buah = [
            ['🥝', '🍓', '🥭'],
            ['🍍', '🍊', '🍋'],
            ['🍉', '🥑', '🍌'],
        ];
        
        const poinRef1 = pointRef.child(sanitizedSender);
        poinRef1.once('value', async (snapshot) => {
          const poin = snapshot.val() || 0;
          const senderName = originalSender;
          if (senderName === originalSender) {
            if (poin >= 500) {
                const result = [];
                for (let i = 0; i < 3; i++) {
                    const row = [];
                    for (let j = 0; j < 3; j++) {
                        const randomIndex = Math.floor(Math.random() * buah.length);
                        const randomBuah = buah[randomIndex];
                        const randomBuahIndex = Math.floor(Math.random() * randomBuah.length);
                        const buahItem = randomBuah[randomBuahIndex];
                        row.push(buahItem);
                    }
                    result.push(row);
                }
              
              let replyMessage = '';
              for (let i = 0; i < result.length; i++) {
                  replyMessage += result[i].join(' ') + '\n';
                }
                setTimeout(() => {
                    message.reply(replyMessage);
                }, 2000);
                    
                if (isWinningCombination(result)) {
                    setTimeout(() =>{
                        const menangSlot = poin + 5000;
                        poinRef1.set(menangSlot);
                        console.log(`menangSlot: ${menangSlot}`);
                        console.log(`sanitizedSender: ${sanitizedSender}`);
                        message.reply('wihh menang 5.000.');
                    }, 2000);
                } else {
                    setTimeout(() =>{
                        const bayarSlot = poin - 500;
                        poinRef1.set(bayarSlot);
                        console.log(`menangSlot: ${bayarSlot}`);
                        console.log(`sanitizedSender: ${sanitizedSender}`);
                        message.reply('yahaha kalah blog, coba lagi sampe miskin');
                    }, 2000);
              }
            } else {
              message.reply('pointnya ga cukup boss, mending jangan dah');
            }
          } else {
            message.reply('err');
          }
        }).catch((err) =>{
            console.log(err)
        });
      }
      
      function isWinningCombination(result) {
        // Cek baris
        for (let i = 0; i < result.length; i++) {
          if (result[i][0] === result[i][1] && result[i][1] === result[i][2]) {
            return true;
          }
        }
      
        // Cek kolom
        for (let j = 0; j < result[0].length; j++) {
          if (result[0][j] === result[1][j] && result[1][j] === result[2][j]) {
            return true;
          }
        }
      
        // Cek diagonal
        if (result[0][0] === result[1][1] && result[1][1] === result[2][2]) {
          return true;
        }
        if (result[0][2] === result[1][1] && result[1][1] === result[2][0]) {
          return true;
        }
      
        return false;
      }


});



 

client.initialize();