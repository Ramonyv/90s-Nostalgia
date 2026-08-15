import type { SceneId } from './scenes'

export type RitualKind = 'calendar' | 'road-cassette' | 'rail-ticket' | 'notebook' | 'coin' | 'antenna' | 'boat' | 'game' | 'rewind' | 'bus-ticket' | 'handpump' | 'meter' | 'photograph' | 'route'

export type SceneRitual = {
  kind: RitualKind
  mark: string
  title: string
  instruction: string
  action: string
  completeLine: string
}

export const rituals: Record<SceneId, SceneRitual> = {
  salon: { kind: 'calendar', mark: 'JUN 96', title: 'तारीख़ बदलें', instruction: 'पुराने कैलेंडर का एक पन्ना धीरे से पलटें।', action: 'पन्ना पलटें', completeLine: 'तारीख़ आगे बढ़ गई। याद वहीं ठहरी रही।' },
  truck: { kind: 'road-cassette', mark: 'SIDE A', title: 'सफ़र का गाना', instruction: 'कैसेट को चलाकर रास्ते को थोड़ी आवाज़ दें।', action: 'कैसेट चलाएँ', completeLine: 'वही गाना। एक और लंबा रास्ता।' },
  railway: { kind: 'rail-ticket', mark: 'PF–2', title: 'टिकट पर मुहर', instruction: 'प्लेटफ़ॉर्म टिकट पर यात्रा की मुहर लगाएँ।', action: 'मुहर लगाएँ', completeLine: 'यात्रा दर्ज हो गई। इंतज़ार का हिसाब नहीं रखा गया।' },
  school: { kind: 'notebook', mark: 'VI–B', title: 'आख़िरी पन्ना', instruction: 'कॉपी के आख़िरी पन्ने पर अपना नाम छोड़ें।', action: 'नाम लिखें', completeLine: 'यह नाम कभी किसी पुरानी कॉपी में भी लिखा था।' },
  cricket: { kind: 'coin', mark: 'TOSS', title: 'आज कौन खेलेगा?', instruction: 'सिक्का उछालें—बैट या बॉल?', action: 'सिक्का उछालें', completeLine: 'फ़ैसला हो गया। नियम अभी भी गली वाले ही हैं।' },
  tv: { kind: 'antenna', mark: 'SIGNAL', title: 'तस्वीर साफ़ करें', instruction: 'ऐन्टेना घुमाएँ जब तक तस्वीर वापस न आ जाए।', action: 'ऐन्टेना घुमाएँ', completeLine: 'अब वहीं रुकना—तस्वीर बिल्कुल साफ़ है।' },
  rain: { kind: 'boat', mark: 'MONSOON', title: 'नाव को जाने दें', instruction: 'काग़ज़ की नाव को बारिश के पानी में छोड़ें।', action: 'नाव छोड़ें', completeLine: 'नाव मोड़ पार कर गई। बचपन थोड़ी दूर तक साथ गया।' },
  gaming: { kind: 'game', mark: 'P2', title: 'Player 2 तैयार?', instruction: 'दूसरा कंट्रोलर उठाकर खेल में शामिल हों।', action: 'START दबाएँ', completeLine: 'PLAYER 2 READY — अब आधा घंटा बहुत जल्दी बीतेगा।' },
  'cassette-shop': { kind: 'rewind', mark: 'REWIND', title: 'पेंसिल वाला जुगाड़', instruction: 'पेंसिल से कैसेट को वापस शुरुआत तक घुमाएँ।', action: 'रीवाइंड करें', completeLine: 'टेप फिर शुरुआत पर है। काश कुछ शामें भी ऐसे लौटतीं।' },
  'bus-stand': { kind: 'bus-ticket', mark: 'WINDOW', title: 'खिड़की वाली सीट', instruction: 'अपना पुराना बस टिकट पंच करवाएँ।', action: 'टिकट पंच करें', completeLine: 'खिड़की वाली सीट मिल गई। सफ़र सफल माना जाएगा।' },
  village: { kind: 'handpump', mark: 'ठंडा पानी', title: 'हैंडपंप चलाएँ', instruction: 'तीन बार हैंडल दबाकर ठंडा पानी निकालें।', action: 'हैंडपंप दबाएँ', completeLine: 'फ्रिज नहीं था। पानी फिर भी इससे ठंडा कभी नहीं लगा।' },
  'auto-rickshaw': { kind: 'meter', mark: '₹ 0.00', title: 'मीटर डाउन', instruction: 'पुराने मीटर को नीचे करके सफ़र शुरू करें।', action: 'मीटर डाउन करें', completeLine: 'मीटर चल पड़ा। हवा का किराया आज भी नहीं लगता।' },
  'adhoori-shaam': { kind: 'photograph', mark: '1997', title: 'तस्वीर पलटें', instruction: 'मेज़ पर रखी पुरानी तस्वीर के पीछे देखें।', action: 'तस्वीर पलटें', completeLine: 'पीछे बस एक तारीख़ थी। बाकी सब आपको याद था।' },
  'highway-adda': { kind: 'route', mark: 'NH–48', title: 'रास्ता याद करें', instruction: 'पुराने नक्शे पर उस रात की सड़क फिर से खींचें।', action: 'रास्ता बनाएँ', completeLine: 'यहाँ चाय पी थी। बाकी रास्ता यादों में है।' },
}
