import { generateColorThemes, oklchConverter } from './colors.js'
import { ColorThemes, Palette } from './types.js'

export const sequential = {
  ember: [
    oklchConverter('#22272b'),
    oklchConverter('#441170'),
    oklchConverter('#d7153a'),
    oklchConverter('#f3631b'),
    oklchConverter('#faaf05'),
  ],
  earthfire: [
    oklchConverter('#523719'),
    oklchConverter('#941b00'),
    oklchConverter('#f3631b'),
    oklchConverter('#faaf05'),
    oklchConverter('#fde79a'),
  ],
  'fuchsia-heat': [
    oklchConverter('#65004d'),
    oklchConverter('#d912ae'),
    oklchConverter('#f3631b'),
    oklchConverter('#faaf05'),
    oklchConverter('#fde79a'),
  ],
  'polar-glow': [
    oklchConverter('#002664'),
    oklchConverter('#146cfd'),
    oklchConverter('#2e808e'),
    oklchConverter('#8cdbe5'),
    oklchConverter('#d1eeea'),
  ],
  'glacier-pool': [
    oklchConverter('#441170'),
    oklchConverter('#8055f1'),
    oklchConverter('#146cfd'),
    oklchConverter('#8ce0ff'),
    oklchConverter('#cbedfd'),
  ],
  'deep-current': [
    oklchConverter('#0b3f47'),
    oklchConverter('#2e808e'),
    oklchConverter('#146cfd'),
    oklchConverter('#8ce0ff'),
    oklchConverter('#cbedfd'),
  ],
}

export const diverging = {
  'blue-red': [
    oklchConverter('#002664'),
    oklchConverter('#146cfd'),
    oklchConverter('#FFFFFF'),
    oklchConverter('#d7153a'),
    oklchConverter('#630019'),
  ],
  'blue-orange': [
    oklchConverter('#002664'),
    oklchConverter('#146cfd'),
    oklchConverter('#FFFFFF'),
    oklchConverter('#f3631b'),
    oklchConverter('#941b00'),
  ],
  'purple-yellow': [
    oklchConverter('#441170'),
    oklchConverter('#8055f1'),
    oklchConverter('#FFFFFF'),
    oklchConverter('#faaf05'),
    oklchConverter('#694800'),
  ],
  'fuchsia-teal': [
    oklchConverter('#65004d'),
    oklchConverter('#d912ae'),
    oklchConverter('#FFFFFF'),
    oklchConverter('#2e808e'),
    oklchConverter('#0b3f47'),
  ],
}

export const brand = {
  grey: [
    oklchConverter('#22272b'),
    oklchConverter('#495054'),
    oklchConverter('#cdd3d6'),
    oklchConverter('#ebebeb'),
  ],
  green: [
    oklchConverter('#004000'),
    oklchConverter('#00aa45'),
    oklchConverter('#a8edb3'),
    oklchConverter('#dbfadf'),
  ],
  teal: [
    oklchConverter('#0b3f47'),
    oklchConverter('#2e808e'),
    oklchConverter('#8cdbe5'),
    oklchConverter('#d1eeea'),
  ],
  blue: [
    oklchConverter('#002664'),
    oklchConverter('#146cfd'),
    oklchConverter('#8ce0ff'),
    oklchConverter('#cbedfd'),
  ],
  purple: [
    oklchConverter('#441170'),
    oklchConverter('#8055f1'),
    oklchConverter('#cebfff'),
    oklchConverter('#e6e1fd'),
  ],
  fuchsia: [
    oklchConverter('#65004d'),
    oklchConverter('#d912ae'),
    oklchConverter('#f4b5e6'),
    oklchConverter('#fddef2'),
  ],
  red: [
    oklchConverter('#630019'),
    oklchConverter('#d7153a'),
    oklchConverter('#ffb8c1'),
    oklchConverter('#ffe6ea'),
  ],
  orange: [
    oklchConverter('#941b00'),
    oklchConverter('#f3631b'),
    oklchConverter('#ffce99'),
    oklchConverter('#fdeddf'),
  ],
  yellow: [
    oklchConverter('#694800'),
    oklchConverter('#faaf05'),
    oklchConverter('#fde79a'),
    oklchConverter('#fff4cf'),
  ],
  brown: [
    oklchConverter('#523719'),
    oklchConverter('#b68d5d'),
    oklchConverter('#e8d0b5'),
    oklchConverter('#ede3d7'),
  ],
}

export const aboriginal = {
  grey: [
    oklchConverter('#272727'),
    oklchConverter('#555555'),
    oklchConverter('#CCC6C2'),
    oklchConverter('#E5E3E0'),
  ],
  red: [
    oklchConverter('#950906'),
    oklchConverter('#E1261C'),
    oklchConverter('#FBB4B3'),
    oklchConverter('#FDD9D9'),
  ],
  orange: [
    oklchConverter('#882600'),
    oklchConverter('#EE6314'),
    oklchConverter('#F4AA7D'),
    oklchConverter('#F9D4BE'),
  ],
  brown: [
    oklchConverter('#552105'),
    oklchConverter('#9E5332'),
    oklchConverter('#D39165'),
    oklchConverter('#E9C8B2'),
  ],
  yellow: [
    oklchConverter('#895E00'),
    oklchConverter('#FEA927'),
    oklchConverter('#FEE48C'),
    oklchConverter('#FFF1C5'),
  ],
  green: [
    oklchConverter('#215834'),
    oklchConverter('#78A146'),
    oklchConverter('#B5CDA4'),
    oklchConverter('#DAE6D1'),
  ],
  blue: [
    oklchConverter('#00405E'),
    oklchConverter('#0D6791'),
    oklchConverter('#84C5D1'),
    oklchConverter('#C1E2E8'),
  ],
  purple: [
    oklchConverter('#472642'),
    oklchConverter('#9A5E93'),
    oklchConverter('#C99AC2'),
    oklchConverter('#E4CCE0'),
  ],
}

export const semantic = {
  success: [
    oklchConverter('#002f00'),
    oklchConverter('#008a07'),
    oklchConverter('#58a854'),
    oklchConverter('#c4e5c0'),
  ],
  warning: [
    oklchConverter('#4b1200'),
    oklchConverter('#C95000'),
    oklchConverter('#dd7d53'),
    oklchConverter('#fdd2c0'),
  ],
  danger: [
    oklchConverter('#44000a'),
    oklchConverter('#B81237'),
    oklchConverter('#d35d65'),
    oklchConverter('#fdc6c6'),
  ],
  info: [
    oklchConverter('#071738'),
    oklchConverter('#2E5299'),
    oklchConverter('#5775ae'),
    oklchConverter('#acbbd5'),
  ],
}

export const allPalettes: Palette[] = [
  {
    baseColors: brand.blue,
    name: 'Primary',
  },
  {
    baseColors: brand.red,
    name: 'Accent',
  },
  {
    baseColors: brand.grey,
    name: 'Grey',
  },
  {
    baseColors: semantic.success,
    name: 'Success',
  },
  {
    baseColors: semantic.warning,
    name: 'Warning',
  },
  {
    baseColors: semantic.danger,
    name: 'Danger',
  },
  {
    baseColors: semantic.info,
    name: 'Info',
  },
  {
    baseColors: brand.grey,
    name: 'NSW Grey',
  },
  {
    baseColors: brand.green,
    name: 'NSW Green',
  },
  {
    baseColors: brand.teal,
    name: 'NSW Teal',
  },
  {
    baseColors: brand.blue,
    name: 'NSW Blue',
  },
  {
    baseColors: brand.purple,
    name: 'NSW Purple',
  },
  {
    baseColors: brand.fuchsia,
    name: 'NSW Fuchsia',
  },
  {
    baseColors: brand.red,
    name: 'NSW Red',
  },
  {
    baseColors: brand.orange,
    name: 'NSW Orange',
  },
  {
    baseColors: brand.yellow,
    name: 'NSW Yellow',
  },
  {
    baseColors: brand.brown,
    name: 'NSW Brown',
  },
  {
    baseColors: aboriginal.grey,
    name: 'NSW Aboriginal Grey',
  },
  {
    baseColors: aboriginal.red,
    name: 'NSW Aboriginal Red',
  },
  {
    baseColors: aboriginal.orange,
    name: 'NSW Aboriginal Orange',
  },
  {
    baseColors: aboriginal.brown,
    name: 'NSW Aboriginal Brown',
  },
  {
    baseColors: aboriginal.yellow,
    name: 'NSW Aboriginal Yellow',
  },
  {
    baseColors: aboriginal.green,
    name: 'NSW Aboriginal Green',
  },
  {
    baseColors: aboriginal.blue,
    name: 'NSW Aboriginal Blue',
  },
  {
    baseColors: aboriginal.purple,
    name: 'NSW Aboriginal Purple',
  },
  {
    baseColors: sequential['ember'],
    name: 'Ember',
    divergent: true,
  },
  {
    baseColors: sequential['earthfire'],
    name: 'Earthfire',
    divergent: true,
  },
  {
    baseColors: sequential['fuchsia-heat'],
    name: 'Fuchsia Heat',
    divergent: true,
  },
  {
    baseColors: sequential['polar-glow'],
    name: 'Polar Glow',
    divergent: true,
  },
  {
    baseColors: sequential['glacier-pool'],
    name: 'Glacier Pool',
    divergent: true,
  },
  {
    baseColors: sequential['deep-current'],
    name: 'Deep Current',
    divergent: true,
  },
  {
    baseColors: diverging['blue-red'],
    name: 'Blue Red',
    divergent: true,
  },
  {
    baseColors: diverging['blue-orange'],
    name: 'Blue Orange',
    divergent: true,
  },
  {
    baseColors: diverging['purple-yellow'],
    name: 'Purple Yellow',
    divergent: true,
  },
  {
    baseColors: diverging['fuchsia-teal'],
    name: 'Fuchsia Teal',
    divergent: true,
  },
]

export const colors: ColorThemes = {
  brand: {
    green: {
      name: 'NSW Green',
      colors: [
        {
          token: 'nsw-green-50',
          oklch:
            'oklch(0.9888862054005949 0.015684460842301393 148.90450809902686)',
          hex: '#f5fff6',
          rgb: 'rgb(245, 255, 246)',
          hsl: 'hsl(126.92, 92.48%, 97.87%)',
        },
        {
          token: 'nsw-green-100',
          oklch:
            'oklch(0.9777724108011899 0.026542933733125437 148.90450809902686)',
          hex: '#ecfdee',
          rgb: 'rgb(236, 253, 238)',
          hsl: 'hsl(127.18, 81.76%, 95.93%)',
        },
        {
          token: 'nsw-green-150',
          oklch:
            'oklch(0.966658616201785 0.03740140662394948 148.90450809902686)',
          hex: '#e4fce7',
          rgb: 'rgb(228, 252, 231)',
          hsl: 'hsl(127.45, 77.77%, 93.96%)',
        },
        {
          token: 'nsw-green-200',
          oklch:
            'oklch(0.9555448216023799 0.04825987951477352 148.90450809902686)',
          hex: '#dbfadf',
          rgb: 'rgb(219, 250, 223)',
          hsl: 'hsl(127.74, 75.61%, 91.96%)',
          name: 'NSW Green 04',
        },
        {
          token: 'nsw-green-250',
          oklch:
            'oklch(0.93795442561214 0.06251830190357965 148.8847612358868)',
          hex: '#cff7d4',
          rgb: 'rgb(207, 247, 212)',
          hsl: 'hsl(128.12, 71.21%, 88.91%)',
        },
        {
          token: 'nsw-green-300',
          oklch:
            'oklch(0.9203640296219002 0.07677672429238579 148.86501437274677)',
          hex: '#c2f4c9',
          rgb: 'rgb(194, 244, 201)',
          hsl: 'hsl(128.55, 68.62%, 85.81%)',
        },
        {
          token: 'nsw-green-350',
          oklch:
            'oklch(0.9027736336316604 0.09103514668119192 148.84526750960674)',
          hex: '#b5f0be',
          rgb: 'rgb(181, 240, 190)',
          hsl: 'hsl(129.02, 66.91%, 82.65%)',
        },
        {
          token: 'nsw-green-400',
          oklch:
            'oklch(0.8851832376414206 0.10529356906999805 148.82552064646669)',
          hex: '#a8edb3',
          rgb: 'rgb(168, 237, 179)',
          hsl: 'hsl(129.57, 65.71%, 79.41%)',
          name: 'NSW Green 03',
        },
        {
          token: 'nsw-green-450',
          oklch:
            'oklch(0.8248441293359839 0.12523789819884273 148.68573660212806)',
          hex: '#8adc98',
          rgb: 'rgb(138, 220, 152)',
          hsl: 'hsl(130.48, 54.36%, 70.18%)',
        },
        {
          token: 'nsw-green-500',
          oklch:
            'oklch(0.7645050210305473 0.14518222732768743 148.54595255778946)',
          hex: '#6acc7d',
          rgb: 'rgb(106, 204, 125)',
          hsl: 'hsl(131.91, 48.76%, 60.63%)',
        },
        {
          token: 'nsw-green-550',
          oklch:
            'oklch(0.7041659127251108 0.16512655645653213 148.40616851345084)',
          hex: '#45bb62',
          rgb: 'rgb(69, 187, 98)',
          hsl: 'hsl(134.54, 46.29%, 50.21%)',
        },
        {
          token: 'nsw-green-600',
          oklch:
            'oklch(0.6438268044196741 0.18507088558537682 148.2663844691122)',
          hex: '#00aa45',
          rgb: 'rgb(0, 170, 69)',
          hsl: 'hsl(144.35, 100%, 33.33%)',
          name: 'NSW Green 02',
        },
        {
          token: 'nsw-green-650',
          oklch:
            'oklch(0.5633395874961222 0.16618487162330642 146.82362307378662)',
          hex: '#078e32',
          rgb: 'rgb(7, 142, 50)',
          hsl: 'hsl(139.28, 90.98%, 29.11%)',
        },
        {
          token: 'nsw-green-700',
          oklch:
            'oklch(0.4828523705725703 0.147298857661236 145.38086167846106)',
          hex: '#077320',
          rgb: 'rgb(7, 115, 32)',
          hsl: 'hsl(134.23, 89.08%, 23.77%)',
        },
        {
          token: 'nsw-green-750',
          oklch:
            'oklch(0.40236515364901837 0.12841284369916556 143.9381002831355)',
          hex: '#03590f',
          rgb: 'rgb(3, 89, 15)',
          hsl: 'hsl(127.99, 92.45%, 18.06%)',
        },
        {
          token: 'nsw-green-800',
          oklch:
            'oklch(0.3218779367254665 0.10952682973709514 142.4953388878099)',
          hex: '#004000',
          rgb: 'rgb(0, 64, 0)',
          hsl: 'hsl(120, 100%, 12.55%)',
          name: 'NSW Green 01',
        },
        {
          token: 'nsw-green-850',
          oklch:
            'oklch(0.2655492977985099 0.09309780527653087 142.4953388878099)',
          hex: '#003000',
          rgb: 'rgb(0, 48, 0)',
          hsl: 'hsl(120.41, 100%, 8.99%)',
        },
        {
          token: 'nsw-green-900',
          oklch:
            'oklch(0.20922065887155322 0.07666878081596659 142.4953388878099)',
          hex: '#002000',
          rgb: 'rgb(0, 32, 0)',
          hsl: 'hsl(120.77, 100%, 5.85%)',
        },
        {
          token: 'nsw-green-950',
          oklch:
            'oklch(0.15289201994459659 0.060239756355402324 142.4953388878099)',
          hex: '#001100',
          rgb: 'rgb(0, 17, 0)',
          hsl: 'hsl(121.17, 100%, 3.07%)',
        },
      ],
    },
    teal: {
      name: 'NSW Teal',
      colors: [
        {
          token: 'nsw-teal-50',
          oklch:
            'oklch(0.9817421856952406 0.010019570541999173 186.58790176853086)',
          hex: '#f2fbfa',
          rgb: 'rgb(242, 251, 250)',
          hsl: 'hsl(171.22, 56.11%, 96.73%)',
        },
        {
          token: 'nsw-teal-100',
          oklch:
            'oklch(0.9634843713904812 0.01695619630184475 186.58790176853086)',
          hex: '#e7f7f5',
          rgb: 'rgb(231, 247, 245)',
          hsl: 'hsl(171.38, 49.48%, 93.72%)',
        },
        {
          token: 'nsw-teal-150',
          oklch:
            'oklch(0.9452265570857217 0.02389282206169033 186.58790176853086)',
          hex: '#dcf2ef',
          rgb: 'rgb(220, 242, 239)',
          hsl: 'hsl(171.55, 47.18%, 90.69%)',
        },
        {
          token: 'nsw-teal-200',
          oklch:
            'oklch(0.9269687427809623 0.03082944782153591 186.58790176853086)',
          hex: '#d1eeea',
          rgb: 'rgb(209, 238, 234)',
          hsl: 'hsl(171.72, 46.03%, 87.65%)',
          name: 'NSW Teal 04',
        },
        {
          token: 'nsw-teal-250',
          oklch:
            'oklch(0.9062032463653427 0.042800313186136286 191.43372937544774)',
          hex: '#c1eae7',
          rgb: 'rgb(193, 234, 231)',
          hsl: 'hsl(176, 49.12%, 83.57%)',
        },
        {
          token: 'nsw-teal-300',
          oklch:
            'oklch(0.8854377499497231 0.054771178550736654 196.27955698236462)',
          hex: '#afe5e5',
          rgb: 'rgb(175, 229, 229)',
          hsl: 'hsl(180.06, 50.95%, 79.35%)',
        },
        {
          token: 'nsw-teal-350',
          oklch:
            'oklch(0.8646722535341036 0.06674204391533703 201.1253845892815)',
          hex: '#9ee0e5',
          rgb: 'rgb(158, 224, 229)',
          hsl: 'hsl(183.68, 57.18%, 75.79%)',
        },
        {
          token: 'nsw-teal-400',
          oklch:
            'oklch(0.843906757118484 0.0787129092799374 205.9712121961984)',
          hex: '#8cdbe5',
          rgb: 'rgb(140, 219, 229)',
          hsl: 'hsl(186.74, 63.12%, 72.35%)',
          name: 'NSW Teal 03',
        },
        {
          token: 'nsw-teal-450',
          oklch:
            'oklch(0.7720750773324279 0.0790813961169628 207.2003147622988)',
          hex: '#75c4cf',
          rgb: 'rgb(117, 196, 207)',
          hsl: 'hsl(187.41, 48.14%, 63.4%)',
        },
        {
          token: 'nsw-teal-500',
          oklch:
            'oklch(0.7002433975463718 0.07944988295398821 208.4294173283992)',
          hex: '#5eacb9',
          rgb: 'rgb(94, 172, 185)',
          hsl: 'hsl(188, 39.25%, 54.56%)',
        },
        {
          token: 'nsw-teal-550',
          oklch:
            'oklch(0.6284117177603156 0.07981836979101362 209.6585198944996)',
          hex: '#4696a3',
          rgb: 'rgb(70, 150, 163)',
          hsl: 'hsl(188.48, 39.69%, 45.78%)',
        },
        {
          token: 'nsw-teal-600',
          oklch: 'oklch(0.5565800379742595 0.08018685662803901 210.8876224606)',
          hex: '#2e808e',
          rgb: 'rgb(46, 128, 142)',
          hsl: 'hsl(188.75, 51.06%, 36.86%)',
          name: 'NSW Teal 02',
        },
        {
          token: 'nsw-teal-650',
          oklch:
            'oklch(0.5022148272886866 0.07346217392494098 210.7415844616744)',
          hex: '#256f7b',
          rgb: 'rgb(37, 111, 123)',
          hsl: 'hsl(188.61, 53.88%, 31.46%)',
        },
        {
          token: 'nsw-teal-700',
          oklch:
            'oklch(0.44784961660311384 0.06673749122184294 210.5955464627488)',
          hex: '#1c5f69',
          rgb: 'rgb(28, 95, 105)',
          hsl: 'hsl(188.45, 57.8%, 26.19%)',
        },
        {
          token: 'nsw-teal-750',
          oklch:
            'oklch(0.39348440591754097 0.06001280851874492 210.4495084638232)',
          hex: '#144e58',
          rgb: 'rgb(20, 78, 88)',
          hsl: 'hsl(188.26, 63.6%, 21.07%)',
        },
        {
          token: 'nsw-teal-800',
          oklch:
            'oklch(0.33911919523196815 0.05328812581564689 210.3034704648976)',
          hex: '#0b3f47',
          rgb: 'rgb(11, 63, 71)',
          hsl: 'hsl(188, 73.17%, 16.08%)',
          name: 'NSW Teal 01',
        },
        {
          token: 'nsw-teal-850',
          oklch:
            'oklch(0.2797733360663737 0.04529490694329986 210.3034704648976)',
          hex: '#042f35',
          rgb: 'rgb(4, 47, 53)',
          hsl: 'hsl(187.99, 84.92%, 11.28%)',
        },
        {
          token: 'nsw-teal-900',
          oklch:
            'oklch(0.2204274769007793 0.037301688070952826 210.3034704648976)',
          hex: '#011f24',
          rgb: 'rgb(1, 31, 36)',
          hsl: 'hsl(188.56, 96.03%, 7.26%)',
        },
        {
          token: 'nsw-teal-950',
          oklch:
            'oklch(0.16108161773518487 0.029308469198605788 210.3034704648976)',
          hex: '#001114',
          rgb: 'rgb(0, 17, 20)',
          hsl: 'hsl(190.58, 100%, 3.88%)',
        },
      ],
    },
    blue: {
      name: 'NSW Blue',
      colors: [
        {
          token: 'nsw-blue-50',
          oklch:
            'oklch(0.9816683948128555 0.013540580086234762 227.890755564881)',
          hex: '#f0fbff',
          rgb: 'rgb(240, 251, 255)',
          hsl: 'hsl(199.45, 100%, 97.34%)',
        },
        {
          token: 'nsw-blue-100',
          oklch:
            'oklch(0.9633367896257109 0.022914827838243446 227.890755564881)',
          hex: '#e4f6ff',
          rgb: 'rgb(228, 246, 255)',
          hsl: 'hsl(199.38, 100%, 94.73%)',
        },
        {
          token: 'nsw-blue-150',
          oklch:
            'oklch(0.9450051844385663 0.032289075590252125 227.890755564881)',
          hex: '#d7f2fe',
          rgb: 'rgb(215, 242, 254)',
          hsl: 'hsl(199.3, 95.85%, 92.09%)',
        },
        {
          token: 'nsw-blue-200',
          oklch:
            'oklch(0.9266735792514218 0.04166332334226081 227.890755564881)',
          hex: '#cbedfd',
          rgb: 'rgb(203, 237, 253)',
          hsl: 'hsl(199.2, 92.59%, 89.41%)',
          name: 'NSW Blue 04',
        },
        {
          token: 'nsw-blue-250',
          oklch:
            'oklch(0.9110280326138016 0.05428316129852959 226.81685418252806)',
          hex: '#bceafe',
          rgb: 'rgb(188, 234, 254)',
          hsl: 'hsl(198.5, 96.87%, 86.75%)',
        },
        {
          token: 'nsw-blue-300',
          oklch:
            'oklch(0.8953824859761815 0.06690299925479838 225.74295280017512)',
          hex: '#ade7ff',
          rgb: 'rgb(173, 231, 255)',
          hsl: 'hsl(197.76, 98.99%, 83.89%)',
        },
        {
          token: 'nsw-blue-350',
          oklch:
            'oklch(0.8797369393385615 0.07952283721106716 224.66905141782217)',
          hex: '#9de3ff',
          rgb: 'rgb(157, 227, 255)',
          hsl: 'hsl(197, 99.87%, 80.82%)',
        },
        {
          token: 'nsw-blue-400',
          oklch:
            'oklch(0.8640913927009413 0.09214267516733594 223.59515003546923)',
          hex: '#8ce0ff',
          rgb: 'rgb(140, 224, 255)',
          hsl: 'hsl(196.17, 100%, 77.45%)',
          name: 'NSW Blue 03',
        },
        {
          token: 'nsw-blue-450',
          oklch:
            'oklch(0.7918467078448571 0.12656541375136143 232.8854457721009)',
          hex: '#5ac9ff',
          rgb: 'rgb(90, 201, 255)',
          hsl: 'hsl(199.74, 99.83%, 67.57%)',
        },
        {
          token: 'nsw-blue-500',
          oklch:
            'oklch(0.719602022988773 0.1609881523353869 242.17574150873253)',
          hex: '#26aeff',
          rgb: 'rgb(38, 174, 255)',
          hsl: 'hsl(202.52, 100%, 57.55%)',
        },
        {
          token: 'nsw-blue-550',
          oklch:
            'oklch(0.6473573381326887 0.19541089091941238 251.4660372453642)',
          hex: '#008fff',
          rgb: 'rgb(0, 143, 255)',
          hsl: 'hsl(204.76, 100%, 46.97%)',
        },
        {
          token: 'nsw-blue-600',
          oklch:
            'oklch(0.5751126532766045 0.2298336295034379 260.75633298199585)',
          hex: '#146cfd',
          rgb: 'rgb(20, 108, 253)',
          hsl: 'hsl(217.34, 98.31%, 53.53%)',
          name: 'NSW Blue 02',
        },
        {
          token: 'nsw-blue-650',
          oklch:
            'oklch(0.5038341615701663 0.20169915825513662 260.52773388396713)',
          hex: '#0c5ad4',
          rgb: 'rgb(12, 90, 212)',
          hsl: 'hsl(216.77, 89.43%, 43.98%)',
        },
        {
          token: 'nsw-blue-700',
          oklch:
            'oklch(0.43255566986372795 0.17356468700683536 260.29913478593846)',
          hex: '#0548ad',
          rgb: 'rgb(5, 72, 173)',
          hsl: 'hsl(216.29, 94.14%, 35%)',
        },
        {
          token: 'nsw-blue-750',
          oklch:
            'oklch(0.3612771781572896 0.1454302157585341 260.07053568790974)',
          hex: '#023688',
          rgb: 'rgb(2, 54, 136)',
          hsl: 'hsl(216.37, 97.67%, 26.93%)',
        },
        {
          token: 'nsw-blue-800',
          oklch:
            'oklch(0.2899986864508513 0.11729574451023282 259.841936589881)',
          hex: '#002664',
          rgb: 'rgb(0, 38, 100)',
          hsl: 'hsl(217.2, 100%, 19.61%)',
          name: 'NSW Blue 01',
        },
        {
          token: 'nsw-blue-850',
          oklch:
            'oklch(0.23924891632195233 0.0997013828336979 259.841936589881)',
          hex: '#001a4d',
          rgb: 'rgb(0, 26, 77)',
          hsl: 'hsl(218.95, 100%, 14.93%)',
        },
        {
          token: 'nsw-blue-900',
          oklch:
            'oklch(0.18849914619305336 0.08210702115716298 259.841936589881)',
          hex: '#001037',
          rgb: 'rgb(0, 16, 55)',
          hsl: 'hsl(222.31, 100%, 10.59%)',
        },
        {
          token: 'nsw-blue-950',
          oklch:
            'oklch(0.13774937606415438 0.06451265948062805 259.841936589881)',
          hex: '#000622',
          rgb: 'rgb(0, 6, 34)',
          hsl: 'hsl(228.65, 100%, 6.6%)',
        },
      ],
    },
    purple: {
      name: 'NSW Purple',
      colors: [
        {
          token: 'nsw-purple-50',
          oklch:
            'oklch(0.9805379794123148 0.012378795916481191 293.8323307371206)',
          hex: '#f9f7ff',
          rgb: 'rgb(249, 247, 255)',
          hsl: 'hsl(250, 100%, 98.76%)',
        },
        {
          token: 'nsw-purple-100',
          oklch:
            'oklch(0.9610759588246297 0.020948731550968172 293.8323307371206)',
          hex: '#f2f0ff',
          rgb: 'rgb(242, 240, 255)',
          hsl: 'hsl(250.23, 100%, 97.09%)',
        },
        {
          token: 'nsw-purple-150',
          oklch:
            'oklch(0.9416139382369446 0.029518667185455153 293.8323307371206)',
          hex: '#ece8fe',
          rgb: 'rgb(236, 232, 254)',
          hsl: 'hsl(250.47, 93.41%, 95.41%)',
        },
        {
          token: 'nsw-purple-200',
          oklch:
            'oklch(0.9221519176492594 0.038088602819942134 293.8323307371206)',
          hex: '#e6e1fd',
          rgb: 'rgb(230, 225, 253)',
          hsl: 'hsl(250.71, 87.5%, 93.73%)',
          name: 'NSW Purple 04',
        },
        {
          token: 'nsw-purple-250',
          oklch:
            'oklch(0.9013385389929451 0.05096960178613127 294.16162791277)',
          hex: '#e0d9fe',
          rgb: 'rgb(224, 217, 254)',
          hsl: 'hsl(251.53, 93.83%, 92.23%)',
        },
        {
          token: 'nsw-purple-300',
          oklch:
            'oklch(0.8805251603366309 0.06385060075232041 294.4909250884194)',
          hex: '#dad0fe',
          rgb: 'rgb(218, 208, 254)',
          hsl: 'hsl(252.35, 97.33%, 90.69%)',
        },
        {
          token: 'nsw-purple-350',
          oklch:
            'oklch(0.8597117816803166 0.07673159971850954 294.8202222640688)',
          hex: '#d4c8ff',
          rgb: 'rgb(212, 200, 255)',
          hsl: 'hsl(253.2, 99.18%, 89.09%)',
        },
        {
          token: 'nsw-purple-400',
          oklch:
            'oklch(0.8388984030240023 0.08961259868469867 295.1495194397181)',
          hex: '#cebfff',
          rgb: 'rgb(206, 191, 255)',
          hsl: 'hsl(254.06, 100%, 87.45%)',
          name: 'NSW Purple 03',
        },
        {
          token: 'nsw-purple-450',
          oklch:
            'oklch(0.7746062729566157 0.12261307668256607 293.98756051942956)',
          hex: '#baa6fc',
          rgb: 'rgb(186, 166, 252)',
          hsl: 'hsl(253.9, 94.13%, 82.01%)',
        },
        {
          token: 'nsw-purple-500',
          oklch:
            'oklch(0.7103141428892291 0.15561355468043347 292.825601599141)',
          hex: '#a68df9',
          rgb: 'rgb(166, 141, 249)',
          hsl: 'hsl(254.11, 90.14%, 76.39%)',
        },
        {
          token: 'nsw-purple-550',
          oklch:
            'oklch(0.6460220128218426 0.1886140326783009 291.6636426788525)',
          hex: '#9372f5',
          rgb: 'rgb(147, 114, 245)',
          hsl: 'hsl(254.88, 87.11%, 70.46%)',
        },
        {
          token: 'nsw-purple-600',
          oklch:
            'oklch(0.5817298827544559 0.2216145106761683 290.50168375856396)',
          hex: '#8055f1',
          rgb: 'rgb(128, 85, 241)',
          hsl: 'hsl(256.54, 84.78%, 63.92%)',
          name: 'NSW Purple 02',
        },
        {
          token: 'nsw-purple-650',
          oklch:
            'oklch(0.5169868726378744 0.203439148040165 293.5593313045061)',
          hex: '#7243cf',
          rgb: 'rgb(114, 67, 207)',
          hsl: 'hsl(260.32, 59.17%, 53.67%)',
        },
        {
          token: 'nsw-purple-700',
          oklch:
            'oklch(0.4522438625212928 0.18526378540416166 296.6169788504482)',
          hex: '#6432ae',
          rgb: 'rgb(100, 50, 174)',
          hsl: 'hsl(264.12, 55.46%, 43.83%)',
        },
        {
          token: 'nsw-purple-750',
          oklch:
            'oklch(0.3875008524047112 0.16708842276815833 299.67462639639035)',
          hex: '#54218e',
          rgb: 'rgb(84, 33, 142)',
          hsl: 'hsl(268.02, 62.04%, 34.39%)',
        },
        {
          token: 'nsw-purple-800',
          oklch:
            'oklch(0.32275784228812965 0.14891306013215502 302.7322739423325)',
          hex: '#441170',
          rgb: 'rgb(68, 17, 112)',
          hsl: 'hsl(272.21, 73.64%, 25.29%)',
          name: 'NSW Purple 01',
        },
        {
          token: 'nsw-purple-850',
          oklch:
            'oklch(0.26627521988770697 0.12657610111233178 302.7322739423325)',
          hex: '#330856',
          rgb: 'rgb(51, 8, 86)',
          hsl: 'hsl(272.75, 82.69%, 18.56%)',
        },
        {
          token: 'nsw-purple-900',
          oklch:
            'oklch(0.2097925974872843 0.10423914209250851 302.7322739423325)',
          hex: '#23023e',
          rgb: 'rgb(35, 2, 62)',
          hsl: 'hsl(272.45, 92.77%, 12.64%)',
        },
        {
          token: 'nsw-purple-950',
          oklch:
            'oklch(0.1533099750868616 0.08190218307268526 302.7322739423325)',
          hex: '#130027',
          rgb: 'rgb(19, 0, 39)',
          hsl: 'hsl(269.95, 100%, 7.66%)',
        },
      ],
    },
    fuchsia: {
      name: 'NSW Fuchsia',
      colors: [
        {
          token: 'nsw-fuchsia-50',
          oklch:
            'oklch(0.9829623738966177 0.01392018614736864 339.13418980883597)',
          hex: '#fff6fd',
          rgb: 'rgb(255, 246, 253)',
          hsl: 'hsl(322.15, 100%, 98.49%)',
        },
        {
          token: 'nsw-fuchsia-100',
          oklch:
            'oklch(0.9659247477932353 0.023557238095546926 339.13418980883597)',
          hex: '#ffeef9',
          rgb: 'rgb(255, 238, 249)',
          hsl: 'hsl(321.87, 100%, 96.73%)',
        },
        {
          token: 'nsw-fuchsia-150',
          oklch:
            'oklch(0.9488871216898529 0.03319429004372521 339.13418980883597)',
          hex: '#fee6f6',
          rgb: 'rgb(254, 230, 246)',
          hsl: 'hsl(321.58, 93.98%, 94.94%)',
        },
        {
          token: 'nsw-fuchsia-200',
          oklch:
            'oklch(0.9318494955864706 0.0428313419919035 339.13418980883597)',
          hex: '#fddef2',
          rgb: 'rgb(253, 222, 242)',
          hsl: 'hsl(321.29, 88.57%, 93.14%)',
          name: 'NSW Fuchsia 04',
        },
        {
          token: 'nsw-fuchsia-250',
          oklch:
            'oklch(0.9103421700940119 0.056169859500935226 337.9783379111923)',
          hex: '#fbd4ef',
          rgb: 'rgb(251, 212, 239)',
          hsl: 'hsl(319.35, 84.42%, 90.79%)',
        },
        {
          token: 'nsw-fuchsia-300',
          oklch:
            'oklch(0.8888348446015532 0.06950837700996695 336.8224860135486)',
          hex: '#f9c9eb',
          rgb: 'rgb(249, 201, 235)',
          hsl: 'hsl(317.38, 80.69%, 88.38%)',
        },
        {
          token: 'nsw-fuchsia-350',
          oklch:
            'oklch(0.8673275191090944 0.08284689451899868 335.6666341159049)',
          hex: '#f7bfe9',
          rgb: 'rgb(247, 191, 233)',
          hsl: 'hsl(315.37, 77.28%, 85.89%)',
        },
        {
          token: 'nsw-fuchsia-400',
          oklch:
            'oklch(0.8458201936166357 0.09618541202803041 334.5107822182612)',
          hex: '#f4b5e6',
          rgb: 'rgb(244, 181, 230)',
          hsl: 'hsl(313.33, 74.12%, 83.33%)',
          name: 'NSW Fuchsia 03',
        },
        {
          token: 'nsw-fuchsia-450',
          oklch:
            'oklch(0.78467847613666 0.13569730252807746 335.94616447972885)',
          hex: '#ef96da',
          rgb: 'rgb(239, 150, 218)',
          hsl: 'hsl(314.16, 73.33%, 76.26%)',
        },
        {
          token: 'nsw-fuchsia-500',
          oklch:
            'oklch(0.7235367586566843 0.17520919302812454 337.3815467411964)',
          hex: '#e975cc',
          rgb: 'rgb(233, 117, 204)',
          hsl: 'hsl(314.67, 72.14%, 68.62%)',
        },
        {
          token: 'nsw-fuchsia-550',
          oklch:
            'oklch(0.6623950411767086 0.2147210835281716 338.816929002664)',
          hex: '#e150be',
          rgb: 'rgb(225, 80, 190)',
          hsl: 'hsl(314.69, 71.13%, 59.86%)',
        },
        {
          token: 'nsw-fuchsia-600',
          oklch:
            'oklch(0.6012533236967328 0.25423297402821865 340.2523112641316)',
          hex: '#d912ae',
          rgb: 'rgb(217, 18, 174)',
          hsl: 'hsl(312.96, 84.68%, 46.08%)',
          name: 'NSW Fuchsia 02',
        },
        {
          token: 'nsw-fuchsia-650',
          oklch:
            'oklch(0.5360839646226407 0.22738751413049402 340.61577057263503)',
          hex: '#bb0c94',
          rgb: 'rgb(187, 12, 148)',
          hsl: 'hsl(313.17, 88.39%, 38.86%)',
        },
        {
          token: 'nsw-fuchsia-700',
          oklch:
            'oklch(0.4709146055485488 0.20054205423276938 340.9792298811385)',
          hex: '#9d067b',
          rgb: 'rgb(157, 6, 123)',
          hsl: 'hsl(313.38, 92.9%, 31.95%)',
        },
        {
          token: 'nsw-fuchsia-750',
          oklch:
            'oklch(0.40574524647445687 0.17369659433504472 341.342689189642)',
          hex: '#810264',
          rgb: 'rgb(129, 2, 100)',
          hsl: 'hsl(313.72, 96.8%, 25.62%)',
        },
        {
          token: 'nsw-fuchsia-800',
          oklch:
            'oklch(0.3405758874003649 0.1468511344373201 341.7061484981454)',
          hex: '#65004d',
          rgb: 'rgb(101, 0, 77)',
          hsl: 'hsl(314.26, 100%, 19.8%)',
          name: 'NSW Fuchsia 01',
        },
        {
          token: 'nsw-fuchsia-850',
          oklch:
            'oklch(0.28097510710530105 0.12482346427172208 341.7061484981454)',
          hex: '#4d003a',
          rgb: 'rgb(77, 0, 58)',
          hsl: 'hsl(314.51, 100%, 14.68%)',
        },
        {
          token: 'nsw-fuchsia-900',
          oklch:
            'oklch(0.22137432681023717 0.10279579410612406 341.7061484981454)',
          hex: '#370028',
          rgb: 'rgb(55, 0, 40)',
          hsl: 'hsl(315.33, 100%, 10.15%)',
        },
        {
          token: 'nsw-fuchsia-950',
          oklch:
            'oklch(0.1617735465151733 0.08076812394052604 341.7061484981454)',
          hex: '#220017',
          rgb: 'rgb(34, 0, 23)',
          hsl: 'hsl(317.48, 100%, 6.11%)',
        },
      ],
    },
    red: {
      name: 'NSW Red',
      colors: [
        {
          token: 'nsw-red-50',
          oklch:
            'oklch(0.9865629857873716 0.009043874600495525 6.653158456152784)',
          hex: '#fff8f9',
          rgb: 'rgb(255, 248, 249)',
          hsl: 'hsl(350.85, 100%, 98.97%)',
        },
        {
          token: 'nsw-red-100',
          oklch:
            'oklch(0.9731259715747431 0.015305018554684736 6.653158456152784)',
          hex: '#fff2f4',
          rgb: 'rgb(255, 242, 244)',
          hsl: 'hsl(350.7, 100%, 97.7%)',
        },
        {
          token: 'nsw-red-150',
          oklch:
            'oklch(0.9596889573621147 0.021566162508873946 6.653158456152784)',
          hex: '#ffecef',
          rgb: 'rgb(255, 236, 239)',
          hsl: 'hsl(350.55, 100%, 96.41%)',
        },
        {
          token: 'nsw-red-200',
          oklch:
            'oklch(0.9462519431494862 0.027827306463063157 6.653158456152784)',
          hex: '#ffe6ea',
          rgb: 'rgb(255, 230, 234)',
          hsl: 'hsl(350.4, 100%, 95.1%)',
          name: 'NSW Red 04',
        },
        {
          token: 'nsw-red-250',
          oklch:
            'oklch(0.9224097820035976 0.041627996281084 7.632544925274676)',
          hex: '#ffdbe0',
          rgb: 'rgb(255, 219, 224)',
          hsl: 'hsl(350.92, 100%, 92.94%)',
        },
        {
          token: 'nsw-red-300',
          oklch:
            'oklch(0.8985676208577089 0.05542868609910484 8.611931394396567)',
          hex: '#ffcfd6',
          rgb: 'rgb(255, 207, 214)',
          hsl: 'hsl(351.43, 100%, 90.72%)',
        },
        {
          token: 'nsw-red-350',
          oklch:
            'oklch(0.8747254597118204 0.06922937591712569 9.59131786351846)',
          hex: '#ffc4cc',
          rgb: 'rgb(255, 196, 204)',
          hsl: 'hsl(351.92, 100%, 88.44%)',
        },
        {
          token: 'nsw-red-400',
          oklch:
            'oklch(0.8508832985659317 0.08303006573514653 10.570704332640352)',
          hex: '#ffb8c1',
          rgb: 'rgb(255, 184, 193)',
          hsl: 'hsl(352.39, 100%, 86.08%)',
          name: 'NSW Red 03',
        },
        {
          token: 'nsw-red-450',
          oklch:
            'oklch(0.7786513285230947 0.11664880226231811 13.011419492803782)',
          hex: '#f897a2',
          rgb: 'rgb(248, 151, 162)',
          hsl: 'hsl(353.39, 86.96%, 78.18%)',
        },
        {
          token: 'nsw-red-500',
          oklch:
            'oklch(0.7064193584802577 0.15026753878948967 15.45213465296721)',
          hex: '#ef7581',
          rgb: 'rgb(239, 117, 129)',
          hsl: 'hsl(353.95, 78.84%, 69.69%)',
        },
        {
          token: 'nsw-red-550',
          oklch:
            'oklch(0.6341873884374207 0.18388627531666124 17.892849813130642)',
          hex: '#e44f5f',
          rgb: 'rgb(228, 79, 95)',
          hsl: 'hsl(353.52, 73.17%, 60.13%)',
        },
        {
          token: 'nsw-red-600',
          oklch:
            'oklch(0.5619554183945837 0.2175050118438328 20.33356497329407)',
          hex: '#d7153a',
          rgb: 'rgb(215, 21, 58)',
          hsl: 'hsl(348.56, 82.2%, 46.27%)',
          name: 'NSW Red 02',
        },
        {
          token: 'nsw-red-650',
          oklch:
            'oklch(0.5007084126233001 0.1948505033631296 19.53345435711309)',
          hex: '#b90e32',
          rgb: 'rgb(185, 14, 50)',
          hsl: 'hsl(347.26, 85.91%, 38.92%)',
        },
        {
          token: 'nsw-red-700',
          oklch:
            'oklch(0.4394614068520166 0.17219599488242637 18.733343740932114)',
          hex: '#9b072a',
          rgb: 'rgb(155, 7, 42)',
          hsl: 'hsl(345.89, 91%, 31.81%)',
        },
        {
          token: 'nsw-red-750',
          oklch:
            'oklch(0.3782144010807331 0.14954148640172313 17.933233124751133)',
          hex: '#7e0322',
          rgb: 'rgb(126, 3, 34)',
          hsl: 'hsl(345, 95.87%, 25.31%)',
        },
        {
          token: 'nsw-red-800',
          oklch:
            'oklch(0.31696739530944956 0.1268869779210199 17.133122508570153)',
          hex: '#630019',
          rgb: 'rgb(99, 0, 25)',
          hsl: 'hsl(344.85, 100%, 19.41%)',
          name: 'NSW Red 01',
        },
        {
          token: 'nsw-red-850',
          oklch:
            'oklch(0.2614981011302959 0.10785393123286692 17.133122508570153)',
          hex: '#4c0010',
          rgb: 'rgb(76, 0, 16)',
          hsl: 'hsl(346.11, 100%, 14.46%)',
        },
        {
          token: 'nsw-red-900',
          oklch:
            'oklch(0.20602880695114223 0.08882088454471393 17.133122508570153)',
          hex: '#360008',
          rgb: 'rgb(54, 0, 8)',
          hsl: 'hsl(349.15, 100%, 10.03%)',
        },
        {
          token: 'nsw-red-950',
          oklch:
            'oklch(0.15055951277198854 0.06978783785656095 17.133122508570153)',
          hex: '#210003',
          rgb: 'rgb(33, 0, 3)',
          hsl: 'hsl(352.16, 100%, 6.06%)',
        },
      ],
    },
    orange: {
      name: 'NSW Orange',
      colors: [
        {
          token: 'nsw-orange-50',
          oklch:
            'oklch(0.9887596459640142 0.008284590272523786 63.743373146104155)',
          hex: '#fffaf6',
          rgb: 'rgb(255, 250, 246)',
          hsl: 'hsl(27.87, 100%, 98.29%)',
        },
        {
          token: 'nsw-orange-100',
          oklch:
            'oklch(0.9775192919280284 0.014020075845809487 63.743373146104155)',
          hex: '#fff6ee',
          rgb: 'rgb(255, 246, 238)',
          hsl: 'hsl(27.91, 96.98%, 96.64%)',
        },
        {
          token: 'nsw-orange-150',
          oklch:
            'oklch(0.9662789378920427 0.019755561419095187 63.743373146104155)',
          hex: '#fef1e7',
          rgb: 'rgb(254, 241, 231)',
          hsl: 'hsl(27.96, 91.29%, 94.99%)',
        },
        {
          token: 'nsw-orange-200',
          oklch:
            'oklch(0.9550385838560569 0.025491046992380886 63.743373146104155)',
          hex: '#fdeddf',
          rgb: 'rgb(253, 237, 223)',
          hsl: 'hsl(28, 88.24%, 93.33%)',
          name: 'NSW Orange 04',
        },
        {
          token: 'nsw-orange-250',
          oklch:
            'oklch(0.9367837854692349 0.041089180700628024 64.93015241128123)',
          hex: '#fee5ce',
          rgb: 'rgb(254, 229, 206)',
          hsl: 'hsl(28.75, 96.77%, 90.26%)',
        },
        {
          token: 'nsw-orange-300',
          oklch:
            'oklch(0.9185289870824129 0.05668731440887516 66.1169316764583)',
          hex: '#ffddbd',
          rgb: 'rgb(255, 221, 189)',
          hsl: 'hsl(29.52, 99.73%, 87.03%)',
        },
        {
          token: 'nsw-orange-350',
          oklch:
            'oklch(0.900274188695591 0.07228544811712229 67.30371094163536)',
          hex: '#ffd6ab',
          rgb: 'rgb(255, 214, 171)',
          hsl: 'hsl(30.32, 100%, 83.62%)',
        },
        {
          token: 'nsw-orange-400',
          oklch:
            'oklch(0.882019390308769 0.08788358182536943 68.49049020681242)',
          hex: '#ffce99',
          rgb: 'rgb(255, 206, 153)',
          hsl: 'hsl(31.18, 100%, 80%)',
          name: 'NSW Orange 03',
        },
        {
          token: 'nsw-orange-450',
          oklch:
            'oklch(0.8301180073463059 0.11402000052072006 61.90488982503486)',
          hex: '#fdb678',
          rgb: 'rgb(253, 182, 120)',
          hsl: 'hsl(28.25, 96.8%, 73.02%)',
        },
        {
          token: 'nsw-orange-500',
          oklch:
            'oklch(0.7782166243838429 0.1401564192160707 55.31928944325728)',
          hex: '#fb9d58',
          rgb: 'rgb(251, 157, 88)',
          hsl: 'hsl(25.48, 94.77%, 66.34%)',
        },
        {
          token: 'nsw-orange-550',
          oklch:
            'oklch(0.7263152414213797 0.16629283791142135 48.73368906147971)',
          hex: '#f78139',
          rgb: 'rgb(247, 129, 57)',
          hsl: 'hsl(22.75, 92.62%, 59.79%)',
        },
        {
          token: 'nsw-orange-600',
          oklch:
            'oklch(0.6744138584589167 0.192429256606772 42.14808867970214)',
          hex: '#f3631b',
          rgb: 'rgb(243, 99, 27)',
          hsl: 'hsl(20, 90%, 52.94%)',
          name: 'NSW Orange 02',
        },
        {
          token: 'nsw-orange-650',
          oklch:
            'oklch(0.6138601814796794 0.18416658101442235 39.866677723327115)',
          hex: '#db5115',
          rgb: 'rgb(219, 81, 21)',
          hsl: 'hsl(18.26, 82.63%, 47%)',
        },
        {
          token: 'nsw-orange-700',
          oklch:
            'oklch(0.5533065045004422 0.17590390542207268 37.585266766952095)',
          hex: '#c33f0e',
          rgb: 'rgb(195, 63, 14)',
          hsl: 'hsl(16.43, 86.72%, 40.94%)',
        },
        {
          token: 'nsw-orange-750',
          oklch:
            'oklch(0.49275282752120486 0.16764122982972302 35.303855810577076)',
          hex: '#ab2e06',
          rgb: 'rgb(171, 46, 6)',
          hsl: 'hsl(14.39, 93.12%, 34.79%)',
        },
        {
          token: 'nsw-orange-800',
          oklch:
            'oklch(0.4321991505419676 0.15937855423737338 33.02244485420205)',
          hex: '#941b00',
          rgb: 'rgb(148, 27, 0)',
          hsl: 'hsl(10.95, 100%, 29.02%)',
          name: 'NSW Orange 01',
        },
        {
          token: 'nsw-orange-850',
          oklch:
            'oklch(0.3565642991971233 0.13547177110176736 33.02244485420205)',
          hex: '#730f00',
          rgb: 'rgb(115, 15, 0)',
          hsl: 'hsl(9.09, 100%, 21.91%)',
        },
        {
          token: 'nsw-orange-900',
          oklch:
            'oklch(0.2809294478522789 0.11156498796616136 33.02244485420205)',
          hex: '#530400',
          rgb: 'rgb(83, 4, 0)',
          hsl: 'hsl(5.29, 100%, 15.58%)',
        },
        {
          token: 'nsw-orange-950',
          oklch:
            'oklch(0.2052945965074346 0.08765820483055536 33.02244485420205)',
          hex: '#350000',
          rgb: 'rgb(53, 0, 0)',
          hsl: 'hsl(2.01, 100%, 9.91%)',
        },
      ],
    },
    yellow: {
      name: 'NSW Yellow',
      colors: [
        {
          token: 'nsw-yellow-50',
          oklch:
            'oklch(0.9916099103487608 0.016065385220578425 93.38344614252667)',
          hex: '#fffcf0',
          rgb: 'rgb(255, 252, 240)',
          hsl: 'hsl(46.46, 100%, 97.31%)',
        },
        {
          token: 'nsw-yellow-100',
          oklch:
            'oklch(0.9832198206975215 0.02718757498867118 93.38344614252667)',
          hex: '#fffae5',
          rgb: 'rgb(255, 250, 229)',
          hsl: 'hsl(46.38, 100%, 95.09%)',
        },
        {
          token: 'nsw-yellow-150',
          oklch:
            'oklch(0.9748297310462821 0.03830976475676393 93.38344614252667)',
          hex: '#fff7da',
          rgb: 'rgb(255, 247, 218)',
          hsl: 'hsl(46.31, 100%, 92.85%)',
        },
        {
          token: 'nsw-yellow-200',
          oklch:
            'oklch(0.9664396413950429 0.049431954524856686 93.38344614252667)',
          hex: '#fff4cf',
          rgb: 'rgb(255, 244, 207)',
          hsl: 'hsl(46.25, 100%, 90.59%)',
          name: 'NSW Yellow 04',
        },
        {
          token: 'nsw-yellow-250',
          oklch:
            'oklch(0.9570183122704129 0.061834853226387446 93.5472306553523)',
          hex: '#fff1c2',
          rgb: 'rgb(255, 241, 194)',
          hsl: 'hsl(46.33, 98.56%, 88%)',
        },
        {
          token: 'nsw-yellow-300',
          oklch:
            'oklch(0.9475969831457829 0.0742377519279182 93.71101516817794)',
          hex: '#feeeb5',
          rgb: 'rgb(254, 238, 181)',
          hsl: 'hsl(46.42, 97.54%, 85.35%)',
        },
        {
          token: 'nsw-yellow-350',
          oklch:
            'oklch(0.938175654021153 0.08664065062944896 93.87479968100357)',
          hex: '#feeaa8',
          rgb: 'rgb(254, 234, 168)',
          hsl: 'hsl(46.53, 96.75%, 82.62%)',
        },
        {
          token: 'nsw-yellow-400',
          oklch:
            'oklch(0.928754324896523 0.09904354933097972 94.0385841938292)',
          hex: '#fde79a',
          rgb: 'rgb(253, 231, 154)',
          hsl: 'hsl(46.67, 96.12%, 79.8%)',
          name: 'NSW Yellow 03',
        },
        {
          token: 'nsw-yellow-450',
          oklch:
            'oklch(0.8978251501132377 0.11612212707646741 89.92658895694369)',
          hex: '#fbda80',
          rgb: 'rgb(251, 218, 128)',
          hsl: 'hsl(43.95, 94.26%, 74.28%)',
        },
        {
          token: 'nsw-yellow-500',
          oklch:
            'oklch(0.8668959753299523 0.13320070482195506 85.81459372005818)',
          hex: '#facd63',
          rgb: 'rgb(250, 205, 99)',
          hsl: 'hsl(41.83, 94.17%, 68.55%)',
        },
        {
          token: 'nsw-yellow-550',
          oklch:
            'oklch(0.8359668005466669 0.15027928256744275 81.7025984831727)',
          hex: '#fabe42',
          rgb: 'rgb(250, 190, 66)',
          hsl: 'hsl(40.46, 94.83%, 62.04%)',
        },
        {
          token: 'nsw-yellow-600',
          oklch:
            'oklch(0.8050376257633817 0.16735786031293043 77.59060324628719)',
          hex: '#faaf05',
          rgb: 'rgb(250, 175, 5)',
          hsl: 'hsl(41.63, 96.08%, 50%)',
          name: 'NSW Yellow 02',
        },
        {
          token: 'nsw-yellow-650',
          oklch:
            'oklch(0.7106097269644318 0.14773585550069343 77.86265854004408)',
          hex: '#d49403',
          rgb: 'rgb(212, 148, 3)',
          hsl: 'hsl(41.71, 97.59%, 41.99%)',
        },
        {
          token: 'nsw-yellow-700',
          oklch:
            'oklch(0.6161818281654818 0.12811385068845643 78.13471383380096)',
          hex: '#af7a01',
          rgb: 'rgb(175, 122, 1)',
          hsl: 'hsl(41.69, 98.72%, 34.44%)',
        },
        {
          token: 'nsw-yellow-750',
          oklch:
            'oklch(0.521753929366532 0.1084918458762194 78.40676912755785)',
          hex: '#8b6000',
          rgb: 'rgb(139, 96, 0)',
          hsl: 'hsl(41.53, 99.5%, 27.31%)',
        },
        {
          token: 'nsw-yellow-800',
          oklch:
            'oklch(0.42732603056758206 0.08886984106398241 78.67882442131474)',
          hex: '#694800',
          rgb: 'rgb(105, 72, 0)',
          hsl: 'hsl(41.14, 100%, 20.59%)',
          name: 'NSW Yellow 01',
        },
        {
          token: 'nsw-yellow-850',
          oklch:
            'oklch(0.3525439752182552 0.07553936490438505 78.67882442131474)',
          hex: '#503500',
          rgb: 'rgb(80, 53, 0)',
          hsl: 'hsl(40.68, 100%, 15.12%)',
        },
        {
          token: 'nsw-yellow-900',
          oklch:
            'oklch(0.27776191986892834 0.06220888874478769 78.67882442131474)',
          hex: '#392400',
          rgb: 'rgb(57, 36, 0)',
          hsl: 'hsl(39.24, 100%, 10.36%)',
        },
        {
          token: 'nsw-yellow-950',
          oklch:
            'oklch(0.20297986451960148 0.04887841258519032 78.67882442131474)',
          hex: '#221300',
          rgb: 'rgb(34, 19, 0)',
          hsl: 'hsl(35.52, 100%, 6.19%)',
        },
      ],
    },
    brown: {
      name: 'NSW Brown',
      colors: [
        {
          token: 'nsw-brown-50',
          oklch:
            'oklch(0.9801175930362143 0.006321527123876961 72.56545339108834)',
          hex: '#fbf8f4',
          rgb: 'rgb(251, 248, 244)',
          hsl: 'hsl(32.66, 48.5%, 97.07%)',
        },
        {
          token: 'nsw-brown-100',
          oklch:
            'oklch(0.9602351860724284 0.010697968978868705 72.56545339108834)',
          hex: '#f6f1ea',
          rgb: 'rgb(246, 241, 234)',
          hsl: 'hsl(32.68, 41.61%, 94.25%)',
        },
        {
          token: 'nsw-brown-150',
          oklch:
            'oklch(0.9403527791086426 0.01507441083386045 72.56545339108834)',
          hex: '#f2eae1',
          rgb: 'rgb(242, 234, 225)',
          hsl: 'hsl(32.7, 39.2%, 91.43%)',
        },
        {
          token: 'nsw-brown-200',
          oklch:
            'oklch(0.9204703721448568 0.01945085268885219 72.56545339108834)',
          hex: '#ede3d7',
          rgb: 'rgb(237, 227, 215)',
          hsl: 'hsl(32.73, 37.93%, 88.63%)',
          name: 'NSW Brown 04',
        },
        {
          token: 'nsw-brown-250',
          oklch:
            'oklch(0.9079853218058483 0.0258503316070154 72.0409329158382)',
          hex: '#ecdece',
          rgb: 'rgb(236, 222, 206)',
          hsl: 'hsl(32.47, 43.13%, 86.7%)',
        },
        {
          token: 'nsw-brown-300',
          oklch:
            'oklch(0.8955002714668399 0.03224981052517861 71.51641244058807)',
          hex: '#eadac6',
          rgb: 'rgb(234, 218, 198)',
          hsl: 'hsl(32.23, 47.04%, 84.79%)',
        },
        {
          token: 'nsw-brown-350',
          oklch:
            'oklch(0.8830152211278313 0.03864928944334182 70.99189196533794)',
          hex: '#e9d5bd',
          rgb: 'rgb(233, 213, 189)',
          hsl: 'hsl(31.99, 50.11%, 82.88%)',
        },
        {
          token: 'nsw-brown-400',
          oklch:
            'oklch(0.8705301707888228 0.04504876836150503 70.4673714900878)',
          hex: '#e8d0b5',
          rgb: 'rgb(232, 208, 181)',
          hsl: 'hsl(31.76, 52.58%, 80.98%)',
          name: 'NSW Brown 03',
        },
        {
          token: 'nsw-brown-450',
          oklch:
            'oklch(0.8207420162298631 0.05412276224933329 70.37812098088949)',
          hex: '#dbbf9f',
          rgb: 'rgb(219, 191, 159)',
          hsl: 'hsl(31.83, 46.02%, 74.17%)',
        },
        {
          token: 'nsw-brown-500',
          oklch:
            'oklch(0.7709538616709035 0.06319675613716154 70.2888704716912)',
          hex: '#cfae89',
          rgb: 'rgb(207, 174, 137)',
          hsl: 'hsl(31.93, 42.16%, 67.4%)',
        },
        {
          token: 'nsw-brown-550',
          oklch:
            'oklch(0.7211657071119438 0.0722707500249898 70.1996199624929)',
          hex: '#c29d73',
          rgb: 'rgb(194, 157, 115)',
          hsl: 'hsl(32.1, 39.63%, 60.67%)',
        },
        {
          token: 'nsw-brown-600',
          oklch:
            'oklch(0.6713775525529841 0.08134474391281805 70.1103694532946)',
          hex: '#b68d5d',
          rgb: 'rgb(182, 141, 93)',
          hsl: 'hsl(32.36, 37.87%, 53.92%)',
          name: 'NSW Brown 02',
        },
        {
          token: 'nsw-brown-650',
          oklch:
            'oklch(0.5938734136361322 0.0756351453597017 69.31281465877314)',
          hex: '#9c764b',
          rgb: 'rgb(156, 118, 75)',
          hsl: 'hsl(32.04, 34.94%, 45.3%)',
        },
        {
          token: 'nsw-brown-700',
          oklch:
            'oklch(0.5163692747192803 0.06992554680658533 68.51525986425168)',
          hex: '#82603a',
          rgb: 'rgb(130, 96, 58)',
          hsl: 'hsl(31.77, 38.54%, 36.92%)',
        },
        {
          token: 'nsw-brown-750',
          oklch:
            'oklch(0.4388651358024283 0.06421594825346898 67.71770506973021)',
          hex: '#6a4b29',
          rgb: 'rgb(106, 75, 41)',
          hsl: 'hsl(31.59, 43.99%, 28.81%)',
        },
        {
          token: 'nsw-brown-800',
          oklch:
            'oklch(0.3613609968855764 0.058506349700352615 66.92015027520875)',
          hex: '#523719',
          rgb: 'rgb(82, 55, 25)',
          hsl: 'hsl(31.58, 53.27%, 20.98%)',
          name: 'NSW Brown 01',
        },
        {
          token: 'nsw-brown-850',
          oklch:
            'oklch(0.2981228224306005 0.04973039724529972 66.92015027520875)',
          hex: '#3e280f',
          rgb: 'rgb(62, 40, 15)',
          hsl: 'hsl(31.74, 60.03%, 15.18%)',
        },
        {
          token: 'nsw-brown-900',
          oklch:
            'oklch(0.23488464797562464 0.04095444479024683 66.92015027520875)',
          hex: '#2b1a07',
          rgb: 'rgb(43, 26, 7)',
          hsl: 'hsl(31.73, 72.62%, 9.74%)',
        },
        {
          token: 'nsw-brown-950',
          oklch:
            'oklch(0.17164647352064877 0.03217849233519394 66.92015027520875)',
          hex: '#190d02',
          rgb: 'rgb(25, 13, 2)',
          hsl: 'hsl(27.95, 86.11%, 5.27%)',
        },
      ],
    },
    grey: {
      name: 'NSW Grey',
      colors: [
        {
          token: 'nsw-grey-50',
          oklch: 'oklch(0.9850175274112574 0 0)',
          hex: '#fafafa',
          rgb: 'rgb(250, 250, 250)',
          hsl: 'hsl(223.81, 0%, 98.03%)',
        },
        {
          token: 'nsw-grey-100',
          oklch: 'oklch(0.9700350548225147 0 0)',
          hex: '#f5f5f5',
          rgb: 'rgb(245, 245, 245)',
          hsl: 'hsl(223.81, 0%, 96.06%)',
        },
        {
          token: 'nsw-grey-150',
          oklch: 'oklch(0.9550525822337722 0 0)',
          hex: '#f0f0f0',
          rgb: 'rgb(240, 240, 240)',
          hsl: 'hsl(223.81, 0%, 94.11%)',
        },
        {
          token: 'nsw-grey-200',
          oklch: 'oklch(0.9400701096450296 0 0)',
          hex: '#ebebeb',
          rgb: 'rgb(235, 235, 235)',
          hsl: 'hsl(223.81, 0%, 92.16%)',
          name: 'NSW Grey 04',
        },
        {
          token: 'nsw-grey-250',
          oklch:
            'oklch(0.9208267112856119 0.0019440594503795112 228.8687380011113)',
          hex: '#e3e5e6',
          rgb: 'rgb(227, 229, 230)',
          hsl: 'hsl(200.05, 4.31%, 89.64%)',
        },
        {
          token: 'nsw-grey-300',
          oklch:
            'oklch(0.9015833129261941 0.0038881189007590215 228.8687380011113)',
          hex: '#dcdfe0',
          rgb: 'rgb(220, 223, 224)',
          hsl: 'hsl(200.03, 6.92%, 87.13%)',
        },
        {
          token: 'nsw-grey-350',
          oklch:
            'oklch(0.8823399145667763 0.005832178351138532 228.8687380011113)',
          hex: '#d4d9db',
          rgb: 'rgb(212, 217, 219)',
          hsl: 'hsl(200.02, 8.65%, 84.64%)',
        },
        {
          token: 'nsw-grey-400',
          oklch:
            'oklch(0.8630965162073586 0.007776237801518043 228.8687380011113)',
          hex: '#cdd3d6',
          rgb: 'rgb(205, 211, 214)',
          hsl: 'hsl(200, 9.89%, 82.16%)',
          name: 'NSW Grey 03',
        },
        {
          token: 'nsw-grey-450',
          oklch:
            'oklch(0.7539290831519737 0.008632737257709678 229.8058410593526)',
          hex: '#aab0b4',
          rgb: 'rgb(170, 176, 180)',
          hsl: 'hsl(200.47, 6.03%, 68.52%)',
        },
        {
          token: 'nsw-grey-500',
          oklch:
            'oklch(0.6447616500965888 0.009489236713901311 230.74294411759388)',
          hex: '#888f92',
          rgb: 'rgb(136, 143, 146)',
          hsl: 'hsl(200.94, 4.51%, 55.36%)',
        },
        {
          token: 'nsw-grey-550',
          oklch:
            'oklch(0.5355942170412039 0.010345736170092946 231.68004717583517)',
          hex: '#686f72',
          rgb: 'rgb(104, 111, 114)',
          hsl: 'hsl(201.39, 4.91%, 42.76%)',
        },
        {
          token: 'nsw-grey-600',
          oklch:
            'oklch(0.426426783985819 0.011202235626284581 232.61715023407646)',
          hex: '#495054',
          rgb: 'rgb(73, 80, 84)',
          hsl: 'hsl(201.82, 7.01%, 30.78%)',
          name: 'NSW Grey 02',
        },
        {
          token: 'nsw-grey-650',
          oklch:
            'oklch(0.3871732148397997 0.010991669591883444 234.98382249287215)',
          hex: '#3f4549',
          rgb: 'rgb(63, 69, 73)',
          hsl: 'hsl(203.03, 7.74%, 26.71%)',
        },
        {
          token: 'nsw-grey-700',
          oklch:
            'oklch(0.3479196456937804 0.010781103557482309 237.35049475166784)',
          hex: '#353b3f',
          rgb: 'rgb(53, 59, 63)',
          hsl: 'hsl(204.24, 8.68%, 22.73%)',
        },
        {
          token: 'nsw-grey-750',
          oklch:
            'oklch(0.3086660765477611 0.010570537523081174 239.71716701046353)',
          hex: '#2b3135',
          rgb: 'rgb(43, 49, 53)',
          hsl: 'hsl(205.45, 9.93%, 18.85%)',
        },
        {
          token: 'nsw-grey-800',
          oklch:
            'oklch(0.26941250740174183 0.010359971488680036 242.08383926925922)',
          hex: '#22272b',
          rgb: 'rgb(34, 39, 43)',
          hsl: 'hsl(206.67, 11.69%, 15.1%)',
          name: 'NSW Grey 01',
        },
        {
          token: 'nsw-grey-850',
          oklch:
            'oklch(0.222265318606437 0.00880597576537803 242.08383926925922)',
          hex: '#181c1f',
          rgb: 'rgb(24, 28, 31)',
          hsl: 'hsl(206.66, 13.37%, 10.7%)',
        },
        {
          token: 'nsw-grey-900',
          oklch:
            'oklch(0.17511812981113217 0.007251980042076026 242.08383926925922)',
          hex: '#0e1113',
          rgb: 'rgb(14, 17, 19)',
          hsl: 'hsl(206.64, 17.01%, 6.52%)',
        },
        {
          token: 'nsw-grey-950',
          oklch:
            'oklch(0.12797094101582737 0.005697984318774021 242.08383926925922)',
          hex: '#050709',
          rgb: 'rgb(5, 7, 9)',
          hsl: 'hsl(208.68, 23.47%, 2.8%)',
        },
      ],
    },
  },
  aboriginal: {
    red: {
      name: 'NSW Aboriginal Red',
      colors: [
        {
          token: 'nsw-aboriginal-red-50',
          oklch:
            'oklch(0.978848545028836 0.013064906949875194 17.91008855652266)',
          hex: '#fff5f5',
          rgb: 'rgb(255, 245, 245)',
          hsl: 'hsl(0.45, 100%, 98.34%)',
        },
        {
          token: 'nsw-aboriginal-red-100',
          oklch:
            'oklch(0.9576970900576719 0.022109842530558015 17.91008855652266)',
          hex: '#ffebeb',
          rgb: 'rgb(255, 235, 235)',
          hsl: 'hsl(0.31, 100%, 96.31%)',
        },
        {
          token: 'nsw-aboriginal-red-150',
          oklch:
            'oklch(0.9365456350865078 0.031154778111240837 17.91008855652266)',
          hex: '#fee2e2',
          rgb: 'rgb(254, 226, 226)',
          hsl: 'hsl(0.16, 96.42%, 94.24%)',
        },
        {
          token: 'nsw-aboriginal-red-200',
          oklch:
            'oklch(0.9153941801153438 0.04019971369192366 17.91008855652266)',
          hex: '#fdd9d9',
          rgb: 'rgb(253, 217, 217)',
          hsl: 'hsl(360, 90%, 92.16%)',
          name: 'Galah Pink',
        },
        {
          token: 'nsw-aboriginal-red-250',
          oklch:
            'oklch(0.8955549511653824 0.05093833595471205 18.4044656497934)',
          hex: '#fdd0d0',
          rgb: 'rgb(253, 208, 208)',
          hsl: 'hsl(0.23, 91.24%, 90.28%)',
        },
        {
          token: 'nsw-aboriginal-red-300',
          oklch:
            'oklch(0.875715722215421 0.06167695821750044 18.898842743064147)',
          hex: '#fcc7c6',
          rgb: 'rgb(252, 199, 198)',
          hsl: 'hsl(0.45, 91.36%, 88.35%)',
        },
        {
          token: 'nsw-aboriginal-red-350',
          oklch:
            'oklch(0.8558764932654596 0.07241558048028882 19.393219836334893)',
          hex: '#fcbdbd',
          rgb: 'rgb(252, 189, 189)',
          hsl: 'hsl(0.65, 90.86%, 86.36%)',
        },
        {
          token: 'nsw-aboriginal-red-400',
          oklch:
            'oklch(0.8360372643154982 0.08315420274307721 19.887596929605635)',
          hex: '#fbb4b3',
          rgb: 'rgb(251, 180, 179)',
          hsl: 'hsl(0.83, 90%, 84.31%)',
          name: 'Coral Pink',
        },
        {
          token: 'nsw-aboriginal-red-450',
          oklch:
            'oklch(0.7733920694093943 0.11749463840365235 22.199733756281407)',
          hex: '#f79693',
          rgb: 'rgb(247, 150, 147)',
          hsl: 'hsl(1.95, 86.73%, 77.32%)',
        },
        {
          token: 'nsw-aboriginal-red-500',
          oklch:
            'oklch(0.7107468745032904 0.15183507406422747 24.51187058295718)',
          hex: '#f27771',
          rgb: 'rgb(242, 119, 113)',
          hsl: 'hsl(2.8, 82.84%, 69.6%)',
        },
        {
          token: 'nsw-aboriginal-red-550',
          oklch:
            'oklch(0.6481016795971866 0.1861755097248026 26.824007409632948)',
          hex: '#ea554c',
          rgb: 'rgb(234, 85, 76)',
          hsl: 'hsl(3.23, 79.15%, 60.92%)',
        },
        {
          token: 'nsw-aboriginal-red-600',
          oklch:
            'oklch(0.5854564846910827 0.22051594538537772 29.13614423630872)',
          hex: '#e1261c',
          rgb: 'rgb(225, 38, 28)',
          hsl: 'hsl(3.05, 77.87%, 49.61%)',
          name: 'Ember Red',
        },
        {
          token: 'nsw-aboriginal-red-650',
          oklch:
            'oklch(0.5451949665626711 0.20759504477588905 29.116922576503878)',
          hex: '#cd1f17',
          rgb: 'rgb(205, 31, 23)',
          hsl: 'hsl(2.8, 80.26%, 44.7%)',
        },
        {
          token: 'nsw-aboriginal-red-700',
          oklch:
            'oklch(0.5049334484342595 0.1946741441664004 29.09770091669904)',
          hex: '#ba1811',
          rgb: 'rgb(186, 24, 17)',
          hsl: 'hsl(2.5, 83.29%, 39.86%)',
        },
        {
          token: 'nsw-aboriginal-red-750',
          oklch:
            'oklch(0.4646719303058479 0.1817532435569117 29.078479256894198)',
          hex: '#a7110b',
          rgb: 'rgb(167, 17, 11)',
          hsl: 'hsl(2.1, 87.31%, 35.06%)',
        },
        {
          token: 'nsw-aboriginal-red-800',
          oklch:
            'oklch(0.4244104121774363 0.16883234294742303 29.059257597089356)',
          hex: '#950906',
          rgb: 'rgb(149, 9, 6)',
          hsl: 'hsl(1.26, 92.26%, 30.39%)',
          name: 'Earth Red',
        },
        {
          token: 'nsw-aboriginal-red-850',
          oklch:
            'oklch(0.3501385900463849 0.14350749150530956 29.059257597089356)',
          hex: '#740001',
          rgb: 'rgb(116, 0, 1)',
          hsl: 'hsl(359.74, 99.82%, 22.68%)',
        },
        {
          token: 'nsw-aboriginal-red-900',
          oklch:
            'oklch(0.2758667679153336 0.11818264006319612 29.059257597089356)',
          hex: '#540000',
          rgb: 'rgb(84, 0, 0)',
          hsl: 'hsl(358.63, 100%, 15.69%)',
        },
        {
          token: 'nsw-aboriginal-red-950',
          oklch:
            'oklch(0.20159494578428225 0.09285778862108267 29.059257597089356)',
          hex: '#360000',
          rgb: 'rgb(54, 0, 0)',
          hsl: 'hsl(357.82, 100%, 9.76%)',
        },
      ],
    },
    orange: {
      name: 'NSW Aboriginal Orange',
      colors: [
        {
          token: 'nsw-aboriginal-orange-50',
          oklch:
            'oklch(0.9738855126989008 0.016602591530904584 52.55546216454561)',
          hex: '#fff4ec',
          rgb: 'rgb(255, 244, 236)',
          hsl: 'hsl(22.11, 100%, 96.57%)',
        },
        {
          token: 'nsw-aboriginal-orange-100',
          oklch:
            'oklch(0.9477710253978014 0.028096693359992375 52.55546216454561)',
          hex: '#fee9dd',
          rgb: 'rgb(254, 233, 221)',
          hsl: 'hsl(22.19, 93.98%, 93.1%)',
        },
        {
          token: 'nsw-aboriginal-orange-150',
          oklch:
            'oklch(0.9216565380967021 0.039590795189080166 52.55546216454561)',
          hex: '#fcdfcd',
          rgb: 'rgb(252, 223, 205)',
          hsl: 'hsl(22.28, 87.05%, 89.61%)',
        },
        {
          token: 'nsw-aboriginal-orange-200',
          oklch:
            'oklch(0.8955420507956029 0.05108489701816796 52.55546216454561)',
          hex: '#f9d4be',
          rgb: 'rgb(249, 212, 190)',
          hsl: 'hsl(22.37, 83.1%, 86.08%)',
          name: 'Sunset Orange',
        },
        {
          token: 'nsw-aboriginal-orange-250',
          oklch:
            'oklch(0.8714459985514821 0.06477537243882539 52.40983339193463)',
          hex: '#f8caae',
          rgb: 'rgb(248, 202, 174)',
          hsl: 'hsl(22.42, 84.33%, 82.75%)',
        },
        {
          token: 'nsw-aboriginal-orange-300',
          oklch:
            'oklch(0.8473499463073613 0.07846584785948284 52.264204619323664)',
          hex: '#f7bf9e',
          rgb: 'rgb(247, 191, 158)',
          hsl: 'hsl(22.48, 84.74%, 79.37%)',
        },
        {
          token: 'nsw-aboriginal-orange-350',
          oklch:
            'oklch(0.8232538940632406 0.09215632328014028 52.11857584671269)',
          hex: '#f6b58e',
          rgb: 'rgb(246, 181, 142)',
          hsl: 'hsl(22.56, 84.7%, 75.91%)',
        },
        {
          token: 'nsw-aboriginal-orange-400',
          oklch:
            'oklch(0.7991578418191198 0.10584679870079772 51.97294707410171)',
          hex: '#f4aa7d',
          rgb: 'rgb(244, 170, 125)',
          hsl: 'hsl(22.69, 84.4%, 72.35%)',
          name: 'Clay Orange',
        },
        {
          token: 'nsw-aboriginal-orange-450',
          oklch:
            'oklch(0.7660019575057643 0.12652886278666134 49.87887684512948)',
          hex: '#f39a66',
          rgb: 'rgb(243, 154, 102)',
          hsl: 'hsl(21.88, 85.61%, 67.77%)',
        },
        {
          token: 'nsw-aboriginal-orange-500',
          oklch:
            'oklch(0.7328460731924087 0.14721092687252496 47.784806616157255)',
          hex: '#f2894f',
          rgb: 'rgb(242, 137, 79)',
          hsl: 'hsl(21.18, 86.15%, 63.01%)',
        },
        {
          token: 'nsw-aboriginal-orange-550',
          oklch:
            'oklch(0.6996901888790532 0.16789299095838855 45.69073638718503)',
          hex: '#f07736',
          rgb: 'rgb(240, 119, 54)',
          hsl: 'hsl(20.78, 86.28%, 57.76%)',
        },
        {
          token: 'nsw-aboriginal-orange-600',
          oklch:
            'oklch(0.6665343045656977 0.18857505504425218 43.5966661582128)',
          hex: '#ee6314',
          rgb: 'rgb(238, 99, 20)',
          hsl: 'hsl(21.74, 86.51%, 50.59%)',
          name: 'Orange Ochre',
        },
        {
          token: 'nsw-aboriginal-orange-650',
          oklch:
            'oklch(0.6048689295059245 0.17619193861850896 42.06662366880586)',
          hex: '#d45310',
          rgb: 'rgb(212, 83, 16)',
          hsl: 'hsl(20.61, 86.17%, 44.61%)',
        },
        {
          token: 'nsw-aboriginal-orange-700',
          oklch:
            'oklch(0.5432035544461513 0.16380882219276577 40.53658117939892)',
          hex: '#ba440a',
          rgb: 'rgb(186, 68, 10)',
          hsl: 'hsl(19.56, 89.48%, 38.49%)',
        },
        {
          token: 'nsw-aboriginal-orange-750',
          oklch:
            'oklch(0.48153817938637805 0.15142570576702258 39.00653868999199)',
          hex: '#a13505',
          rgb: 'rgb(161, 53, 5)',
          hsl: 'hsl(18.46, 94.45%, 32.41%)',
        },
        {
          token: 'nsw-aboriginal-orange-800',
          oklch:
            'oklch(0.41987280432660484 0.13904258934127936 37.47649620058505)',
          hex: '#882600',
          rgb: 'rgb(136, 38, 0)',
          hsl: 'hsl(16.76, 100%, 26.67%)',
          name: 'Deep Orange',
        },
        {
          token: 'nsw-aboriginal-orange-850',
          oklch:
            'oklch(0.346395063569449 0.11818620094008746 37.47649620058505)',
          hex: '#691900',
          rgb: 'rgb(105, 25, 0)',
          hsl: 'hsl(15.47, 100%, 20.07%)',
        },
        {
          token: 'nsw-aboriginal-orange-900',
          oklch:
            'oklch(0.27291732281229314 0.09732981253889555 37.47649620058505)',
          hex: '#4c0d00',
          rgb: 'rgb(76, 13, 0)',
          hsl: 'hsl(12.18, 100%, 14.2%)',
        },
        {
          token: 'nsw-aboriginal-orange-950',
          oklch:
            'oklch(0.1994395820551373 0.07647342413770365 37.47649620058505)',
          hex: '#300300',
          rgb: 'rgb(48, 3, 0)',
          hsl: 'hsl(6.72, 100%, 8.94%)',
        },
      ],
    },
    brown: {
      name: 'NSW Aboriginal Brown',
      colors: [
        {
          token: 'nsw-aboriginal-brown-50',
          oklch:
            'oklch(0.9637894047428377 0.015576586829445453 55.65798606883124)',
          hex: '#fcf1e9',
          rgb: 'rgb(252, 241, 233)',
          hsl: 'hsl(23.71, 74.46%, 95.12%)',
        },
        {
          token: 'nsw-aboriginal-brown-100',
          oklch:
            'oklch(0.9275788094856755 0.02636037771136923 55.65798606883124)',
          hex: '#f6e3d7',
          rgb: 'rgb(246, 227, 215)',
          hsl: 'hsl(23.8, 62.46%, 90.28%)',
        },
        {
          token: 'nsw-aboriginal-brown-150',
          oklch:
            'oklch(0.8913682142285133 0.037144168593293 55.65798606883124)',
          hex: '#efd5c4',
          rgb: 'rgb(239, 213, 196)',
          hsl: 'hsl(23.89, 58.05%, 85.44%)',
        },
        {
          token: 'nsw-aboriginal-brown-200',
          oklch:
            'oklch(0.855157618971351 0.04792795947521678 55.65798606883124)',
          hex: '#e9c8b2',
          rgb: 'rgb(233, 200, 178)',
          hsl: 'hsl(24, 55.56%, 80.59%)',
          name: 'Macadamia Brown',
        },
        {
          token: 'nsw-aboriginal-brown-250',
          oklch:
            'oklch(0.819495130372929 0.060854957675237686 55.274819963495716)',
          hex: '#e4ba9f',
          rgb: 'rgb(228, 186, 159)',
          hsl: 'hsl(23.94, 55.92%, 75.8%)',
        },
        {
          token: 'nsw-aboriginal-brown-300',
          oklch:
            'oklch(0.783832641774507 0.07378195587525858 54.8916538581602)',
          hex: '#dead8c',
          rgb: 'rgb(222, 173, 140)',
          hsl: 'hsl(23.91, 55.95%, 70.98%)',
        },
        {
          token: 'nsw-aboriginal-brown-350',
          oklch:
            'oklch(0.7481701531760849 0.0867089540752795 54.50848775282467)',
          hex: '#d99f78',
          rgb: 'rgb(217, 159, 120)',
          hsl: 'hsl(23.92, 55.79%, 66.12%)',
        },
        {
          token: 'nsw-aboriginal-brown-400',
          oklch:
            'oklch(0.7125076645776629 0.0996359522753004 54.125321647489145)',
          hex: '#d39165',
          rgb: 'rgb(211, 145, 101)',
          hsl: 'hsl(24, 55.56%, 61.18%)',
          name: 'Claystone Brown',
        },
        {
          token: 'nsw-aboriginal-brown-450',
          oklch:
            'oklch(0.6658642886991106 0.10220482966257746 51.472089235271014)',
          hex: '#c68158',
          rgb: 'rgb(198, 129, 88)',
          hsl: 'hsl(22.67, 49.07%, 55.96%)',
        },
        {
          token: 'nsw-aboriginal-brown-500',
          oklch:
            'oklch(0.6192209128205584 0.10477370704985453 48.81885682305288)',
          hex: '#b9724b',
          rgb: 'rgb(185, 114, 75)',
          hsl: 'hsl(21.29, 43.84%, 50.82%)',
        },
        {
          token: 'nsw-aboriginal-brown-550',
          oklch:
            'oklch(0.5725775369420062 0.1073425844371316 46.165624410834745)',
          hex: '#ab623e',
          rgb: 'rgb(171, 98, 62)',
          hsl: 'hsl(19.86, 46.79%, 45.77%)',
        },
        {
          token: 'nsw-aboriginal-brown-600',
          oklch:
            'oklch(0.5259341610634539 0.10991146182440867 43.512391998616614)',
          hex: '#9e5332',
          rgb: 'rgb(158, 83, 50)',
          hsl: 'hsl(18.33, 51.92%, 40.78%)',
          name: 'Firewood Brown',
        },
        {
          token: 'nsw-aboriginal-brown-650',
          oklch:
            'oklch(0.4745053224355554 0.10391808522528324 43.80561561418423)',
          hex: '#8b4627',
          rgb: 'rgb(139, 70, 39)',
          hsl: 'hsl(18.72, 56.45%, 34.86%)',
        },
        {
          token: 'nsw-aboriginal-brown-700',
          oklch:
            'oklch(0.42307648380765683 0.09792470862615782 44.09883922975184)',
          hex: '#79391c',
          rgb: 'rgb(121, 57, 28)',
          hsl: 'hsl(19.21, 62.79%, 29.04%)',
        },
        {
          token: 'nsw-aboriginal-brown-750',
          oklch:
            'oklch(0.37164764517975835 0.09193133202703241 44.39206284531945)',
          hex: '#672d10',
          rgb: 'rgb(103, 45, 16)',
          hsl: 'hsl(19.97, 72.56%, 23.3%)',
        },
        {
          token: 'nsw-aboriginal-brown-800',
          oklch:
            'oklch(0.3202188065518598 0.08593795542790698 44.68528646088706)',
          hex: '#552105',
          rgb: 'rgb(85, 33, 5)',
          hsl: 'hsl(21, 88.89%, 17.65%)',
          name: 'Riverbed Brown',
        },
        {
          token: 'nsw-aboriginal-brown-850',
          oklch:
            'oklch(0.2641805154052843 0.07304726211372094 44.68528646088706)',
          hex: '#411602',
          rgb: 'rgb(65, 22, 2)',
          hsl: 'hsl(19.73, 95.19%, 12.97%)',
        },
        {
          token: 'nsw-aboriginal-brown-900',
          oklch:
            'oklch(0.20814222425870887 0.06015656879953489 44.68528646088706)',
          hex: '#2d0c00',
          rgb: 'rgb(45, 12, 0)',
          hsl: 'hsl(16.27, 100%, 8.82%)',
        },
        {
          token: 'nsw-aboriginal-brown-950',
          oklch:
            'oklch(0.15210393311213338 0.04726587548534884 44.68528646088706)',
          hex: '#1b0400',
          rgb: 'rgb(27, 4, 0)',
          hsl: 'hsl(10.45, 100%, 5.14%)',
        },
      ],
    },
    yellow: {
      name: 'NSW Aboriginal Yellow',
      colors: [
        {
          token: 'nsw-aboriginal-yellow-50',
          oklch:
            'oklch(0.989587621092196 0.019103088481096563 92.48002960723814)',
          hex: '#fffcee',
          rgb: 'rgb(255, 252, 238)',
          hsl: 'hsl(45.72, 100%, 96.78%)',
        },
        {
          token: 'nsw-aboriginal-yellow-100',
          oklch:
            'oklch(0.979175242184392 0.03232830358339418 92.48002960723814)',
          hex: '#fff8e0',
          rgb: 'rgb(255, 248, 224)',
          hsl: 'hsl(45.63, 100%, 94.1%)',
        },
        {
          token: 'nsw-aboriginal-yellow-150',
          oklch:
            'oklch(0.9687628632765881 0.0455535186856918 92.48002960723814)',
          hex: '#fff5d3',
          rgb: 'rgb(255, 245, 211)',
          hsl: 'hsl(45.57, 100%, 91.38%)',
        },
        {
          token: 'nsw-aboriginal-yellow-200',
          oklch:
            'oklch(0.9583504843687841 0.05877873378798942 92.48002960723814)',
          hex: '#fff1c5',
          rgb: 'rgb(255, 241, 197)',
          hsl: 'hsl(45.52, 100%, 88.63%)',
          name: 'Sunbeam Yellow',
        },
        {
          token: 'nsw-aboriginal-yellow-250',
          oklch:
            'oklch(0.9491347371136292 0.07198796755327139 92.7305165933987)',
          hex: '#ffeeb7',
          rgb: 'rgb(255, 238, 183)',
          hsl: 'hsl(45.68, 99.59%, 85.94%)',
        },
        {
          token: 'nsw-aboriginal-yellow-300',
          oklch:
            'oklch(0.9399189898584743 0.08519720131855335 92.98100357955929)',
          hex: '#ffeba9',
          rgb: 'rgb(255, 235, 169)',
          hsl: 'hsl(45.86, 99.15%, 83.16%)',
        },
        {
          token: 'nsw-aboriginal-yellow-350',
          oklch:
            'oklch(0.9307032426033194 0.09840643508383531 93.23149056571987)',
          hex: '#fee79b',
          rgb: 'rgb(254, 231, 155)',
          hsl: 'hsl(46.07, 98.71%, 80.28%)',
        },
        {
          token: 'nsw-aboriginal-yellow-400',
          oklch:
            'oklch(0.9214874953481644 0.11161566884911728 93.48197755188043)',
          hex: '#fee48c',
          rgb: 'rgb(254, 228, 140)',
          hsl: 'hsl(46.32, 98.28%, 77.25%)',
          name: 'Golden Wattle Yellow',
        },
        {
          token: 'nsw-aboriginal-yellow-450',
          oklch:
            'oklch(0.8910195189839808 0.12436290150788638 87.85568397462671)',
          hex: '#fed675',
          rgb: 'rgb(254, 214, 117)',
          hsl: 'hsl(42.77, 97.91%, 72.64%)',
        },
        {
          token: 'nsw-aboriginal-yellow-500',
          oklch:
            'oklch(0.8605515426197972 0.1371101341666555 82.22939039737301)',
          hex: '#fec85d',
          rgb: 'rgb(254, 200, 93)',
          hsl: 'hsl(39.92, 98.26%, 68.02%)',
        },
        {
          token: 'nsw-aboriginal-yellow-550',
          oklch:
            'oklch(0.8300835662556136 0.1498573668254246 76.60309682011929)',
          hex: '#feb944',
          rgb: 'rgb(254, 185, 68)',
          hsl: 'hsl(37.69, 98.75%, 63.17%)',
        },
        {
          token: 'nsw-aboriginal-yellow-600',
          oklch: 'oklch(0.79961558989143 0.1626045994841937 70.97680324286557)',
          hex: '#fea927',
          rgb: 'rgb(254, 169, 39)',
          hsl: 'hsl(36.28, 99.08%, 57.45%)',
          name: 'Sandstone Yellow',
        },
        {
          token: 'nsw-aboriginal-yellow-650',
          oklch:
            'oklch(0.7283788119804733 0.14880860016855085 72.64225880919277)',
          hex: '#df961c',
          rgb: 'rgb(223, 150, 28)',
          hsl: 'hsl(37.45, 77.64%, 49.26%)',
        },
        {
          token: 'nsw-aboriginal-yellow-700',
          oklch:
            'oklch(0.6571420340695165 0.13501260085290803 74.30771437551996)',
          hex: '#c18312',
          rgb: 'rgb(193, 131, 18)',
          hsl: 'hsl(38.69, 83.35%, 41.35%)',
        },
        {
          token: 'nsw-aboriginal-yellow-750',
          oklch:
            'oklch(0.5859052561585598 0.1212166015372652 75.97316994184717)',
          hex: '#a57007',
          rgb: 'rgb(165, 112, 7)',
          hsl: 'hsl(40.07, 91.76%, 33.66%)',
        },
        {
          token: 'nsw-aboriginal-yellow-800',
          oklch:
            'oklch(0.5146684782476031 0.10742060222162236 77.63862550817437)',
          hex: '#895e00',
          rgb: 'rgb(137, 94, 0)',
          hsl: 'hsl(41.17, 100%, 26.86%)',
          name: 'Bush Honey Yellow',
        },
        {
          token: 'nsw-aboriginal-yellow-850',
          oklch:
            'oklch(0.42460149455427254 0.09130751188837902 77.63862550817437)',
          hex: '#694700',
          rgb: 'rgb(105, 71, 0)',
          hsl: 'hsl(41.1, 100%, 19.64%)',
        },
        {
          token: 'nsw-aboriginal-yellow-900',
          oklch:
            'oklch(0.334534510860942 0.07519442155513566 77.63862550817437)',
          hex: '#4c3000',
          rgb: 'rgb(76, 48, 0)',
          hsl: 'hsl(40.13, 100%, 13.55%)',
        },
        {
          token: 'nsw-aboriginal-yellow-950',
          oklch:
            'oklch(0.24446752716761147 0.059081331221892304 77.63862550817437)',
          hex: '#2f1c00',
          rgb: 'rgb(47, 28, 0)',
          hsl: 'hsl(37.35, 100%, 8.33%)',
        },
      ],
    },
    green: {
      name: 'NSW Aboriginal Green',
      colors: [
        {
          token: 'nsw-aboriginal-green-50',
          oklch:
            'oklch(0.9775400515432829 0.010033373009012674 131.56364967590204)',
          hex: '#f5f9f2',
          rgb: 'rgb(245, 249, 242)',
          hsl: 'hsl(94.61, 37.03%, 96.34%)',
        },
        {
          token: 'nsw-aboriginal-green-100',
          oklch:
            'oklch(0.9550801030865659 0.016979554322944526 131.56364967590204)',
          hex: '#ecf3e7',
          rgb: 'rgb(236, 243, 231)',
          hsl: 'hsl(94.51, 32.21%, 92.9%)',
        },
        {
          token: 'nsw-aboriginal-green-150',
          oklch:
            'oklch(0.9326201546298487 0.023925735636876375 131.56364967590204)',
          hex: '#e3ecdc',
          rgb: 'rgb(227, 236, 220)',
          hsl: 'hsl(94.4, 30.49%, 89.48%)',
        },
        {
          token: 'nsw-aboriginal-green-200',
          oklch:
            'oklch(0.9101602061731316 0.030871916950808227 131.56364967590204)',
          hex: '#dae6d1',
          rgb: 'rgb(218, 230, 209)',
          hsl: 'hsl(94.29, 29.58%, 86.08%)',
          name: 'Saltbush Green',
        },
        {
          token: 'nsw-aboriginal-green-250',
          oklch:
            'oklch(0.8874934999312177 0.03857982981011093 131.78279512830795)',
          hex: '#d1e0c6',
          rgb: 'rgb(209, 224, 198)',
          hsl: 'hsl(94.5, 29.43%, 82.62%)',
        },
        {
          token: 'nsw-aboriginal-green-300',
          oklch:
            'oklch(0.8648267936893037 0.04628774266941364 132.0019405807139)',
          hex: '#c7d9ba',
          rgb: 'rgb(199, 217, 186)',
          hsl: 'hsl(94.72, 29.3%, 79.18%)',
        },
        {
          token: 'nsw-aboriginal-green-350',
          oklch:
            'oklch(0.8421600874473898 0.053995655528716345 132.22108603311983)',
          hex: '#bed3af',
          rgb: 'rgb(190, 211, 175)',
          hsl: 'hsl(94.92, 29.18%, 75.76%)',
        },
        {
          token: 'nsw-aboriginal-green-400',
          oklch:
            'oklch(0.8194933812054759 0.061703568388019055 132.44023148552574)',
          hex: '#b5cda4',
          rgb: 'rgb(181, 205, 164)',
          hsl: 'hsl(95.12, 29.08%, 72.35%)',
          name: 'Gumleaf Green',
        },
        {
          token: 'nsw-aboriginal-green-450',
          oklch:
            'oklch(0.7793221671789816 0.078504962905952 131.72356982833844)',
          hex: '#a5c28e',
          rgb: 'rgb(165, 194, 142)',
          hsl: 'hsl(93.46, 30.08%, 65.88%)',
        },
        {
          token: 'nsw-aboriginal-green-500',
          oklch:
            'oklch(0.7391509531524875 0.09530635742388496 131.0069081711511)',
          hex: '#95b777',
          rgb: 'rgb(149, 183, 119)',
          hsl: 'hsl(91.63, 30.85%, 59.29%)',
        },
        {
          token: 'nsw-aboriginal-green-550',
          oklch:
            'oklch(0.6989797391259933 0.11210775194181792 130.29024651396378)',
          hex: '#86ac60',
          rgb: 'rgb(134, 172, 96)',
          hsl: 'hsl(89.55, 31.61%, 52.5%)',
        },
        {
          token: 'nsw-aboriginal-green-600',
          oklch:
            'oklch(0.658808525099499 0.12890914645975088 129.57358485677648)',
          hex: '#78a146',
          rgb: 'rgb(120, 161, 70)',
          hsl: 'hsl(87.03, 39.39%, 45.29%)',
          name: 'Marshland Lime',
        },
        {
          token: 'nsw-aboriginal-green-650',
          oklch:
            'oklch(0.5974184207826408 0.11760535943305413 135.2430093260659)',
          hex: '#5f8f44',
          rgb: 'rgb(95, 143, 68)',
          hsl: 'hsl(97.99, 35.67%, 41.28%)',
        },
        {
          token: 'nsw-aboriginal-green-700',
          oklch:
            'oklch(0.5360283164657826 0.10630157240635738 140.91243379535533)',
          hex: '#497d40',
          rgb: 'rgb(73, 125, 64)',
          hsl: 'hsl(111.48, 32.13%, 36.95%)',
        },
        {
          token: 'nsw-aboriginal-green-750',
          oklch:
            'oklch(0.47463821214892454 0.09499778537966062 146.58185826464475)',
          hex: '#346a3b',
          rgb: 'rgb(52, 106, 59)',
          hsl: 'hsl(127.58, 34.41%, 30.98%)',
        },
        {
          token: 'nsw-aboriginal-green-800',
          oklch:
            'oklch(0.41324810783206634 0.08369399835296387 152.25128273393418)',
          hex: '#215834',
          rgb: 'rgb(33, 88, 52)',
          hsl: 'hsl(140.73, 45.45%, 23.73%)',
          name: 'Bushland Green',
        },
        {
          token: 'nsw-aboriginal-green-850',
          oklch:
            'oklch(0.3409296889614547 0.07113989860001929 152.25128273393418)',
          hex: '#154225',
          rgb: 'rgb(21, 66, 37)',
          hsl: 'hsl(141.23, 51.5%, 17.2%)',
        },
        {
          token: 'nsw-aboriginal-green-900',
          oklch:
            'oklch(0.2686112700908431 0.05858579884707471 152.25128273393418)',
          hex: '#0a2e17',
          rgb: 'rgb(10, 46, 23)',
          hsl: 'hsl(142.1, 64.01%, 11%)',
        },
        {
          token: 'nsw-aboriginal-green-950',
          oklch:
            'oklch(0.1962928512202315 0.04603169909413013 152.25128273393418)',
          hex: '#021b0a',
          rgb: 'rgb(2, 27, 10)',
          hsl: 'hsl(139.39, 83.32%, 5.75%)',
        },
      ],
    },
    blue: {
      name: 'NSW Aboriginal Blue',
      colors: [
        {
          token: 'nsw-aboriginal-blue-50',
          oklch:
            'oklch(0.9726963960813712 0.01158607281784324 209.8212580578204)',
          hex: '#eef8fa',
          rgb: 'rgb(238, 248, 250)',
          hsl: 'hsl(189.24, 57.11%, 95.67%)',
        },
        {
          token: 'nsw-aboriginal-blue-100',
          oklch:
            'oklch(0.9453927921627423 0.019607200153273174 209.8212580578204)',
          hex: '#dff1f4',
          rgb: 'rgb(223, 241, 244)',
          hsl: 'hsl(189.24, 49.64%, 91.57%)',
        },
        {
          token: 'nsw-aboriginal-blue-150',
          oklch:
            'oklch(0.9180891882441133 0.027628327488703107 209.8212580578204)',
          hex: '#d0e9ee',
          rgb: 'rgb(208, 233, 238)',
          hsl: 'hsl(189.24, 47.11%, 87.45%)',
        },
        {
          token: 'nsw-aboriginal-blue-200',
          oklch:
            'oklch(0.8907855843254845 0.035649454824133044 209.8212580578204)',
          hex: '#c1e2e8',
          rgb: 'rgb(193, 226, 232)',
          hsl: 'hsl(189.23, 45.88%, 83.33%)',
          name: 'Coastal Blue',
        },
        {
          token: 'nsw-aboriginal-blue-250',
          oklch:
            'oklch(0.8640751367196432 0.04375221215713473 209.95866132774938)',
          hex: '#b2dbe2',
          rgb: 'rgb(178, 219, 226)',
          hsl: 'hsl(189.29, 45.53%, 79.28%)',
        },
        {
          token: 'nsw-aboriginal-blue-300',
          oklch:
            'oklch(0.8373646891138018 0.05185496949013642 210.09606459767838)',
          hex: '#a3d4dc',
          rgb: 'rgb(163, 212, 220)',
          hsl: 'hsl(189.34, 45.39%, 75.19%)',
        },
        {
          token: 'nsw-aboriginal-blue-350',
          oklch:
            'oklch(0.8106542415079605 0.0599577268231381 210.23346786760737)',
          hex: '#94ccd7',
          rgb: 'rgb(148, 204, 215)',
          hsl: 'hsl(189.36, 45.41%, 71.06%)',
        },
        {
          token: 'nsw-aboriginal-blue-400',
          oklch:
            'oklch(0.7839437939021192 0.06806048415613979 210.37087113753637)',
          hex: '#84c5d1',
          rgb: 'rgb(132, 197, 209)',
          hsl: 'hsl(189.35, 45.56%, 66.86%)',
          name: 'Light Water Blue',
        },
        {
          token: 'nsw-aboriginal-blue-450',
          oklch:
            'oklch(0.7096613718024245 0.0763659542620009 216.89866687611752)',
          hex: '#67aec0',
          rgb: 'rgb(103, 174, 192)',
          hsl: 'hsl(192.66, 41.82%, 57.86%)',
        },
        {
          token: 'nsw-aboriginal-blue-500',
          oklch:
            'oklch(0.6353789497027299 0.08467142436786204 223.42646261469866)',
          hex: '#4a96b0',
          rgb: 'rgb(74, 150, 176)',
          hsl: 'hsl(195.5, 40.89%, 49.12%)',
        },
        {
          token: 'nsw-aboriginal-blue-550',
          oklch:
            'oklch(0.5610965276030352 0.09297689447372316 229.9542583532798)',
          hex: '#2e7fa1',
          rgb: 'rgb(46, 127, 161)',
          hsl: 'hsl(197.85, 55.74%, 40.47%)',
        },
        {
          token: 'nsw-aboriginal-blue-600',
          oklch:
            'oklch(0.48681410550334053 0.10128236457958428 236.48205409186096)',
          hex: '#0d6791',
          rgb: 'rgb(13, 103, 145)',
          hsl: 'hsl(199.09, 83.54%, 30.98%)',
          name: 'Saltwater Blue',
        },
        {
          token: 'nsw-aboriginal-blue-650',
          oklch:
            'oklch(0.45314276771770134 0.09524485078789424 236.66470281995805)',
          hex: '#095d84',
          rgb: 'rgb(9, 93, 132)',
          hsl: 'hsl(198.97, 87.58%, 27.58%)',
        },
        {
          token: 'nsw-aboriginal-blue-700',
          oklch:
            'oklch(0.4194714299320621 0.0892073369962042 236.84735154805517)',
          hex: '#055377',
          rgb: 'rgb(5, 83, 119)',
          hsl: 'hsl(198.92, 91.86%, 24.33%)',
        },
        {
          token: 'nsw-aboriginal-blue-750',
          oklch:
            'oklch(0.3858000921464229 0.08316982320451415 237.0300002761523)',
          hex: '#02496a',
          rgb: 'rgb(2, 73, 106)',
          hsl: 'hsl(198.97, 96.01%, 21.29%)',
        },
        {
          token: 'nsw-aboriginal-blue-800',
          oklch:
            'oklch(0.3521287543607837 0.0771323094128241 237.21264900424939)',
          hex: '#00405e',
          rgb: 'rgb(0, 64, 94)',
          hsl: 'hsl(199.15, 100%, 18.43%)',
          name: 'Billabong Blue',
        },
        {
          token: 'nsw-aboriginal-blue-850',
          oklch:
            'oklch(0.29050622234764656 0.06556246300090049 237.21264900424939)',
          hex: '#002f48',
          rgb: 'rgb(0, 47, 72)',
          hsl: 'hsl(199.78, 100%, 13.65%)',
        },
        {
          token: 'nsw-aboriginal-blue-900',
          oklch:
            'oklch(0.22888369033450942 0.053992616588976874 237.21264900424939)',
          hex: '#002033',
          rgb: 'rgb(0, 32, 51)',
          hsl: 'hsl(201.38, 100%, 9.4%)',
        },
        {
          token: 'nsw-aboriginal-blue-950',
          oklch:
            'oklch(0.16726115832137228 0.04242277017705326 237.21264900424939)',
          hex: '#00111f',
          rgb: 'rgb(0, 17, 31)',
          hsl: 'hsl(205.34, 100%, 5.61%)',
        },
      ],
    },
    purple: {
      name: 'NSW Aboriginal Purple',
      colors: [
        {
          token: 'nsw-aboriginal-purple-50',
          oklch:
            'oklch(0.9677519235816936 0.01225423399018933 331.39469318233586)',
          hex: '#faf1f8',
          rgb: 'rgb(250, 241, 248)',
          hsl: 'hsl(310.68, 42.61%, 96.28%)',
        },
        {
          token: 'nsw-aboriginal-purple-100',
          oklch:
            'oklch(0.9355038471633873 0.020737934444935786 331.39469318233586)',
          hex: '#f2e5f0',
          rgb: 'rgb(242, 229, 240)',
          hsl: 'hsl(310.46, 34.93%, 92.41%)',
        },
        {
          token: 'nsw-aboriginal-purple-150',
          oklch:
            'oklch(0.903255770745081 0.02922163489968224 331.39469318233586)',
          hex: '#ebd8e8',
          rgb: 'rgb(235, 216, 232)',
          hsl: 'hsl(310.24, 32.24%, 88.56%)',
        },
        {
          token: 'nsw-aboriginal-purple-200',
          oklch:
            'oklch(0.8710076943267746 0.0377053353544287 331.39469318233586)',
          hex: '#e4cce0',
          rgb: 'rgb(228, 204, 224)',
          hsl: 'hsl(310, 30.77%, 84.71%)',
          name: 'Dusk Purple',
        },
        {
          token: 'nsw-aboriginal-purple-250',
          oklch:
            'oklch(0.8389191100209297 0.04764157951006853 331.4172179039917)',
          hex: '#ddbfd8',
          rgb: 'rgb(221, 191, 216)',
          hsl: 'hsl(309.75, 30.82%, 80.93%)',
        },
        {
          token: 'nsw-aboriginal-purple-300',
          oklch:
            'oklch(0.8068305257150847 0.05757782366570837 331.4397426256475)',
          hex: '#d7b3d1',
          rgb: 'rgb(215, 179, 209)',
          hsl: 'hsl(309.5, 30.72%, 77.16%)',
        },
        {
          token: 'nsw-aboriginal-purple-350',
          oklch:
            'oklch(0.7747419414092399 0.06751406782134821 331.46226734730334)',
          hex: '#d0a6c9',
          rgb: 'rgb(208, 166, 201)',
          hsl: 'hsl(309.22, 30.55%, 73.39%)',
        },
        {
          token: 'nsw-aboriginal-purple-400',
          oklch:
            'oklch(0.742653357103395 0.07745031197698804 331.48479206895917)',
          hex: '#c99ac2',
          rgb: 'rgb(201, 154, 194)',
          hsl: 'hsl(308.94, 30.32%, 69.61%)',
          name: 'Lilli Pilli Purple',
        },
        {
          token: 'nsw-aboriginal-purple-450',
          oklch:
            'oklch(0.6987279730890662 0.08461715270888535 331.3997569775923)',
          hex: '#bd8bb6',
          rgb: 'rgb(189, 139, 182)',
          hsl: 'hsl(308.5, 27.72%, 64.31%)',
        },
        {
          token: 'nsw-aboriginal-purple-500',
          oklch:
            'oklch(0.6548025890747375 0.09178399344078267 331.31472188622536)',
          hex: '#b17caa',
          rgb: 'rgb(177, 124, 170)',
          hsl: 'hsl(308.03, 25.74%, 59.05%)',
        },
        {
          token: 'nsw-aboriginal-purple-550',
          oklch: 'oklch(0.6108772050604088 0.09895083417268 331.2296867948585)',
          hex: '#a66d9f',
          rgb: 'rgb(166, 109, 159)',
          hsl: 'hsl(307.53, 24.18%, 53.83%)',
        },
        {
          token: 'nsw-aboriginal-purple-600',
          oklch:
            'oklch(0.56695182104608 0.10611767490457731 331.1446517034916)',
          hex: '#9a5e93',
          rgb: 'rgb(154, 94, 147)',
          hsl: 'hsl(307, 24.19%, 48.63%)',
          name: 'Spirit Lilac',
        },
        {
          token: 'nsw-aboriginal-purple-650',
          oklch:
            'oklch(0.5059681066477375 0.09597195429905764 331.53840819994554)',
          hex: '#844f7e',
          rgb: 'rgb(132, 79, 126)',
          hsl: 'hsl(307.56, 25.08%, 41.48%)',
        },
        {
          token: 'nsw-aboriginal-purple-700',
          oklch:
            'oklch(0.4449843922493949 0.08582623369353798 331.93216469639947)',
          hex: '#6f4169',
          rgb: 'rgb(111, 65, 105)',
          hsl: 'hsl(308.1, 26.24%, 34.55%)',
        },
        {
          token: 'nsw-aboriginal-purple-750',
          oklch:
            'oklch(0.38400067785105235 0.07568051308801832 332.32592119285346)',
          hex: '#5b3355',
          rgb: 'rgb(91, 51, 85)',
          hsl: 'hsl(308.61, 27.86%, 27.83%)',
        },
        {
          token: 'nsw-aboriginal-purple-800',
          oklch:
            'oklch(0.3230169634527098 0.06553479248249865 332.7196776893074)',
          hex: '#472642',
          rgb: 'rgb(71, 38, 66)',
          hsl: 'hsl(309.09, 30.28%, 21.37%)',
          name: 'Bush Plum',
        },
        {
          token: 'nsw-aboriginal-purple-850',
          oklch:
            'oklch(0.2664889948484856 0.05570457361012385 332.7196776893074)',
          hex: '#351a31',
          rgb: 'rgb(53, 26, 49)',
          hsl: 'hsl(308.99, 33.57%, 15.63%)',
        },
        {
          token: 'nsw-aboriginal-purple-900',
          oklch:
            'oklch(0.20996102624426138 0.04587435473774905 332.7196776893074)',
          hex: '#241021',
          rgb: 'rgb(36, 16, 33)',
          hsl: 'hsl(308.83, 40.05%, 10.18%)',
        },
        {
          token: 'nsw-aboriginal-purple-950',
          oklch:
            'oklch(0.15343305764003715 0.036044135865374256 332.7196776893074)',
          hex: '#150612',
          rgb: 'rgb(21, 6, 18)',
          hsl: 'hsl(308.92, 54.82%, 5.21%)',
        },
      ],
    },
    grey: {
      name: 'NSW Aboriginal Grey',
      colors: [
        {
          token: 'nsw-aboriginal-grey-50',
          oklch:
            'oklch(0.9791354942965652 0.0014935040072708932 78.29695339492076)',
          hex: '#f9f8f7',
          rgb: 'rgb(249, 248, 247)',
          hsl: 'hsl(35.99, 11.4%, 97.16%)',
        },
        {
          token: 'nsw-aboriginal-grey-100',
          oklch:
            'oklch(0.9582709885931304 0.002527468319996896 78.29695339492076)',
          hex: '#f2f1ef',
          rgb: 'rgb(242, 241, 239)',
          hsl: 'hsl(36, 9.67%, 94.37%)',
        },
        {
          token: 'nsw-aboriginal-grey-150',
          oklch:
            'oklch(0.9374064828896956 0.0035614326327228986 78.29695339492076)',
          hex: '#ebeae8',
          rgb: 'rgb(235, 234, 232)',
          hsl: 'hsl(36, 9.08%, 91.59%)',
        },
        {
          token: 'nsw-aboriginal-grey-200',
          oklch:
            'oklch(0.9165419771862608 0.004595396945448901 78.29695339492076)',
          hex: '#e5e3e0',
          rgb: 'rgb(229, 227, 224)',
          hsl: 'hsl(36, 8.77%, 88.82%)',
          name: 'Smoke Grey',
        },
        {
          token: 'nsw-aboriginal-grey-250',
          oklch:
            'oklch(0.8949688443848074 0.005626888799288963 72.79487392970944)',
          hex: '#dfdcd8',
          rgb: 'rgb(223, 220, 216)',
          hsl: 'hsl(32.79, 8.86%, 86.06%)',
        },
        {
          token: 'nsw-aboriginal-grey-300',
          oklch:
            'oklch(0.8733957115833539 0.006658380653129026 67.29279446449813)',
          hex: '#d8d4d1',
          rgb: 'rgb(216, 212, 209)',
          hsl: 'hsl(29.76, 8.93%, 83.34%)',
        },
        {
          token: 'nsw-aboriginal-grey-350',
          oklch:
            'oklch(0.8518225787819006 0.007689872506969089 61.79071499928681)',
          hex: '#d2cdc9',
          rgb: 'rgb(210, 205, 201)',
          hsl: 'hsl(26.85, 8.96%, 80.67%)',
        },
        {
          token: 'nsw-aboriginal-grey-400',
          oklch:
            'oklch(0.8302494459804471 0.00872136436080915 56.288635534075496)',
          hex: '#ccc6c2',
          rgb: 'rgb(204, 198, 194)',
          hsl: 'hsl(24, 8.93%, 78.04%)',
          name: 'Ash Grey',
        },
        {
          token: 'nsw-aboriginal-grey-450',
          oklch:
            'oklch(0.7350703829754051 0.006541023270606863 56.288635534075496)',
          hex: '#ada8a5',
          rgb: 'rgb(173, 168, 165)',
          hsl: 'hsl(23.99, 4.23%, 66.26%)',
        },
        {
          token: 'nsw-aboriginal-grey-500',
          oklch:
            'oklch(0.6398913199703631 0.004360682180404575 56.288635534075496)',
          hex: '#8e8b8a',
          rgb: 'rgb(142, 139, 138)',
          hsl: 'hsl(23.97, 2.04%, 54.85%)',
        },
        {
          token: 'nsw-aboriginal-grey-550',
          oklch:
            'oklch(0.544712256965321 0.0021803410902022876 56.288635534075496)',
          hex: '#71706f',
          rgb: 'rgb(113, 112, 111)',
          hsl: 'hsl(23.95, 1.01%, 43.86%)',
        },
        {
          token: 'nsw-aboriginal-grey-600',
          oklch: 'oklch(0.4495331939602789 0 0)',
          hex: '#555555',
          rgb: 'rgb(85, 85, 85)',
          hsl: 'hsl(223.81, 0%, 33.33%)',
          name: 'Emu Grey',
        },
        {
          token: 'nsw-aboriginal-grey-650',
          oklch: 'oklch(0.40533514521305436 0 0)',
          hex: '#494949',
          rgb: 'rgb(73, 73, 73)',
          hsl: 'hsl(223.81, 0%, 28.62%)',
        },
        {
          token: 'nsw-aboriginal-grey-700',
          oklch: 'oklch(0.3611370964658298 0 0)',
          hex: '#3d3d3d',
          rgb: 'rgb(61, 61, 61)',
          hsl: 'hsl(223.81, 0%, 24.04%)',
        },
        {
          token: 'nsw-aboriginal-grey-750',
          oklch: 'oklch(0.3169390477186052 0 0)',
          hex: '#323232',
          rgb: 'rgb(50, 50, 50)',
          hsl: 'hsl(223.81, 0%, 19.59%)',
        },
        {
          token: 'nsw-aboriginal-grey-800',
          oklch: 'oklch(0.27274099897138065 0 0)',
          hex: '#272727',
          rgb: 'rgb(39, 39, 39)',
          hsl: 'hsl(223.81, 0%, 15.29%)',
          name: 'Charcoal Grey',
        },
        {
          token: 'nsw-aboriginal-grey-850',
          oklch: 'oklch(0.22501132415138902 0 0)',
          hex: '#1c1c1c',
          rgb: 'rgb(28, 28, 28)',
          hsl: 'hsl(223.81, 0%, 10.85%)',
        },
        {
          token: 'nsw-aboriginal-grey-900',
          oklch: 'oklch(0.17728164933139742 0 0)',
          hex: '#111111',
          rgb: 'rgb(17, 17, 17)',
          hsl: 'hsl(223.81, 0%, 6.64%)',
        },
        {
          token: 'nsw-aboriginal-grey-950',
          oklch: 'oklch(0.12955197451140582 0 0)',
          hex: '#070707',
          rgb: 'rgb(7, 7, 7)',
          hsl: 'hsl(223.81, 0%, 2.81%)',
        },
      ],
    },
  },
  semantic: {
    success: {
      name: 'Success',
      colors: [
        {
          token: 'success-50',
          oklch:
            'oklch(0.9720355476100955 0.01978729853872853 142.11752406542539)',
          hex: '#eff9ed',
          rgb: 'rgb(239, 249, 237)',
          hsl: 'hsl(113.15, 52.52%, 95.43%)',
        },
        {
          token: 'success-100',
          oklch:
            'oklch(0.944071095220191 0.03348619752707904 142.11752406542539)',
          hex: '#e0f3de',
          rgb: 'rgb(224, 243, 222)',
          hsl: 'hsl(113.26, 45.54%, 91.13%)',
        },
        {
          token: 'success-150',
          oklch:
            'oklch(0.9161066428302864 0.04718509651542956 142.11752406542539)',
          hex: '#d2eccf',
          rgb: 'rgb(210, 236, 207)',
          hsl: 'hsl(113.38, 42.97%, 86.84%)',
        },
        {
          token: 'success-200',
          oklch:
            'oklch(0.8881421904403819 0.06088399550378008 142.11752406542539)',
          hex: '#c4e5c0',
          rgb: 'rgb(196, 229, 192)',
          hsl: 'hsl(113.51, 41.57%, 82.55%)',
          name: 'Success 04',
        },
        {
          token: 'success-250',
          oklch:
            'oklch(0.8312289461835737 0.0814134964867239 142.2964842668701)',
          hex: '#aad6a5',
          rgb: 'rgb(170, 214, 165)',
          hsl: 'hsl(114.16, 37.16%, 74.26%)',
        },
        {
          token: 'success-300',
          oklch:
            'oklch(0.7743157019267655 0.10194299746966773 142.47544446831483)',
          hex: '#8fc78a',
          rgb: 'rgb(143, 199, 138)',
          hsl: 'hsl(114.93, 34.81%, 66.02%)',
        },
        {
          token: 'success-350',
          oklch:
            'oklch(0.7174024576699572 0.12247249845261154 142.65440466975954)',
          hex: '#74b76f',
          rgb: 'rgb(116, 183, 111)',
          hsl: 'hsl(115.88, 33.38%, 57.78%)',
        },
        {
          token: 'success-400',
          oklch:
            'oklch(0.660489213413149 0.14300199943555536 142.83336487120425)',
          hex: '#58a854',
          rgb: 'rgb(88, 168, 84)',
          hsl: 'hsl(117.14, 33.33%, 49.41%)',
          name: 'Success 03',
        },
        {
          token: 'success-450',
          oklch:
            'oklch(0.6326270919832794 0.153487552492673 142.8252122365381)',
          hex: '#49a146',
          rgb: 'rgb(73, 161, 70)',
          hsl: 'hsl(117.67, 39.56%, 45.11%)',
        },
        {
          token: 'success-500',
          oklch:
            'oklch(0.6047649705534097 0.16397310554979067 142.81705960187193)',
          hex: '#399936',
          rgb: 'rgb(57, 153, 54)',
          hsl: 'hsl(118.38, 47.88%, 40.58%)',
        },
        {
          token: 'success-550',
          oklch:
            'oklch(0.57690284912354 0.17445865860690835 142.80890696720576)',
          hex: '#259224',
          rgb: 'rgb(37, 146, 36)',
          hsl: 'hsl(119.53, 60.48%, 35.56%)',
        },
        {
          token: 'success-600',
          oklch:
            'oklch(0.5490407276936703 0.184944211664026 142.8007543325396)',
          hex: '#008a07',
          rgb: 'rgb(0, 138, 7)',
          hsl: 'hsl(123.04, 100%, 27.06%)',
          name: 'Success 02',
        },
        {
          token: 'success-650',
          oklch:
            'oklch(0.4778879989458421 0.16120283434453703 142.72440047135717)',
          hex: '#007204',
          rgb: 'rgb(0, 114, 4)',
          hsl: 'hsl(121.8, 99.36%, 22.38%)',
        },
        {
          token: 'success-700',
          oklch:
            'oklch(0.40673527019801387 0.13746145702504803 142.64804661017473)',
          hex: '#005a02',
          rgb: 'rgb(0, 90, 2)',
          hsl: 'hsl(120.9, 99.22%, 17.81%)',
        },
        {
          token: 'success-750',
          oklch:
            'oklch(0.3355825414501856 0.11372007970555903 142.57169274899232)',
          hex: '#004401',
          rgb: 'rgb(0, 68, 1)',
          hsl: 'hsl(120.32, 99.47%, 13.4%)',
        },
        {
          token: 'success-800',
          oklch:
            'oklch(0.26442981270235744 0.08997870238607004 142.49533888780988)',
          hex: '#002f00',
          rgb: 'rgb(0, 47, 0)',
          hsl: 'hsl(120, 100%, 9.22%)',
          name: 'Success 01',
        },
        {
          token: 'success-850',
          oklch:
            'oklch(0.21815459547944488 0.07648189702815954 142.49533888780988)',
          hex: '#002200',
          rgb: 'rgb(0, 34, 0)',
          hsl: 'hsl(120.32, 100%, 6.51%)',
        },
        {
          token: 'success-900',
          oklch:
            'oklch(0.17187937825653232 0.06298509167024903 142.49533888780988)',
          hex: '#001600',
          rgb: 'rgb(0, 22, 0)',
          hsl: 'hsl(120.63, 100%, 4.07%)',
        },
        {
          token: 'success-950',
          oklch:
            'oklch(0.12560416103361977 0.04948828631233853 142.49533888780988)',
          hex: '#000b00',
          rgb: 'rgb(0, 11, 0)',
          hsl: 'hsl(121.08, 100%, 1.88%)',
        },
      ],
    },
    warning: {
      name: 'Warning',
      colors: [
        {
          token: 'warning-50',
          oklch:
            'oklch(0.9739777778864123 0.017695077274685146 43.9454781334139)',
          hex: '#fff3ed',
          rgb: 'rgb(255, 243, 237)',
          hsl: 'hsl(17.53, 100%, 96.97%)',
        },
        {
          token: 'warning-100',
          oklch:
            'oklch(0.9479555557728245 0.029945515387928705 43.9454781334139)',
          hex: '#ffe8de',
          rgb: 'rgb(255, 232, 222)',
          hsl: 'hsl(17.59, 100%, 93.77%)',
        },
        {
          token: 'warning-150',
          oklch:
            'oklch(0.9219333336592369 0.042195953501172265 43.9454781334139)',
          hex: '#ffddcf',
          rgb: 'rgb(255, 221, 207)',
          hsl: 'hsl(17.65, 99.09%, 90.53%)',
        },
        {
          token: 'warning-200',
          oklch:
            'oklch(0.8959111115456492 0.05444639161441583 43.9454781334139)',
          hex: '#fdd2c0',
          rgb: 'rgb(253, 210, 192)',
          hsl: 'hsl(17.7, 93.85%, 87.25%)',
          name: 'Warning 04',
        },
        {
          token: 'warning-250',
          oklch:
            'oklch(0.8436567377995562 0.07383969866253859 43.88732593200177)',
          hex: '#f6bda5',
          rgb: 'rgb(246, 189, 165)',
          hsl: 'hsl(17.77, 81.71%, 80.57%)',
        },
        {
          token: 'warning-300',
          oklch:
            'oklch(0.7914023640534633 0.09323300571066136 43.829173730589645)',
          hex: '#eea88a',
          rgb: 'rgb(238, 168, 138)',
          hsl: 'hsl(17.84, 74.94%, 73.78%)',
        },
        {
          token: 'warning-350',
          oklch:
            'oklch(0.7391479903073703 0.11262631275878413 43.77102152917751)',
          hex: '#e6936f',
          rgb: 'rgb(230, 147, 111)',
          hsl: 'hsl(17.98, 70.36%, 66.84%)',
        },
        {
          token: 'warning-400',
          oklch:
            'oklch(0.6868936165612773 0.13201961980690688 43.71286932776538)',
          hex: '#dd7d53',
          rgb: 'rgb(221, 125, 83)',
          hsl: 'hsl(18.26, 66.99%, 59.61%)',
          name: 'Warning 03',
        },
        {
          token: 'warning-450',
          oklch:
            'oklch(0.6610028202949751 0.14144095719007027 43.78396833320002)',
          hex: '#d87244',
          rgb: 'rgb(216, 114, 68)',
          hsl: 'hsl(18.61, 65.61%, 55.79%)',
        },
        {
          token: 'warning-500',
          oklch:
            'oklch(0.635112024028673 0.15086229457323366 43.85506733863466)',
          hex: '#d36734',
          rgb: 'rgb(211, 103, 52)',
          hsl: 'hsl(19.18, 64.53%, 51.69%)',
        },
        {
          token: 'warning-550',
          oklch:
            'oklch(0.6092212277623706 0.16028363195639705 43.9261663440693)',
          hex: '#ce5c21',
          rgb: 'rgb(206, 92, 33)',
          hsl: 'hsl(20.31, 72.21%, 46.96%)',
        },
        {
          token: 'warning-600',
          oklch:
            'oklch(0.5833304314960684 0.16970496933956045 43.99726534950394)',
          hex: '#c95000',
          rgb: 'rgb(201, 80, 0)',
          hsl: 'hsl(23.88, 100%, 39.41%)',
          name: 'Warning 02',
        },
        {
          token: 'warning-650',
          oklch: 'oklch(0.507009085738871 0.149901753081645 42.56483564766481)',
          hex: '#a83f03',
          rgb: 'rgb(168, 63, 3)',
          hsl: 'hsl(21.95, 96.66%, 33.46%)',
        },
        {
          token: 'warning-700',
          oklch:
            'oklch(0.43068773998167365 0.13009853682372957 41.13240594582567)',
          hex: '#882f03',
          rgb: 'rgb(136, 47, 3)',
          hsl: 'hsl(20.07, 95.99%, 27.13%)',
        },
        {
          token: 'warning-750',
          oklch:
            'oklch(0.3543663942244763 0.11029532056581412 39.69997624398653)',
          hex: '#692001',
          rgb: 'rgb(105, 32, 1)',
          hsl: 'hsl(17.86, 97.32%, 20.78%)',
        },
        {
          token: 'warning-800',
          oklch:
            'oklch(0.2780450484672789 0.09049210430789867 38.26754654214739)',
          hex: '#4b1200',
          rgb: 'rgb(75, 18, 0)',
          hsl: 'hsl(14.4, 100%, 14.71%)',
          name: 'Warning 01',
        },
        {
          token: 'warning-850',
          oklch:
            'oklch(0.2293871649855051 0.07691828866171387 38.26754654214739)',
          hex: '#390a00',
          rgb: 'rgb(57, 10, 0)',
          hsl: 'hsl(11.43, 100%, 10.95%)',
        },
        {
          token: 'warning-900',
          oklch:
            'oklch(0.1807292815037313 0.06334447301552906 38.26754654214739)',
          hex: '#270400',
          rgb: 'rgb(39, 4, 0)',
          hsl: 'hsl(7.67, 100%, 7.5%)',
        },
        {
          token: 'warning-950',
          oklch:
            'oklch(0.13207139802195747 0.04977065736934427 38.26754654214739)',
          hex: '#170100',
          rgb: 'rgb(23, 1, 0)',
          hsl: 'hsl(4.64, 100%, 4.34%)',
        },
      ],
    },
    danger: {
      name: 'Danger',
      colors: [
        {
          token: 'danger-50',
          oklch:
            'oklch(0.9688081012787089 0.02046893571008903 18.42817489942577)',
          hex: '#fff0ef',
          rgb: 'rgb(255, 240, 239)',
          hsl: 'hsl(0.78, 100%, 97.61%)',
        },
        {
          token: 'danger-100',
          oklch:
            'oklch(0.9376162025574177 0.034639737355535286 18.42817489942577)',
          hex: '#ffe2e1',
          rgb: 'rgb(255, 226, 225)',
          hsl: 'hsl(0.56, 100%, 94.61%)',
        },
        {
          token: 'danger-150',
          oklch:
            'oklch(0.9064243038361265 0.048810539000981534 18.42817489942577)',
          hex: '#ffd4d4',
          rgb: 'rgb(255, 212, 212)',
          hsl: 'hsl(0.3, 100%, 91.55%)',
        },
        {
          token: 'danger-200',
          oklch:
            'oklch(0.8752324051148354 0.06298134064642778 18.42817489942577)',
          hex: '#fdc6c6',
          rgb: 'rgb(253, 198, 198)',
          hsl: 'hsl(0, 93.22%, 88.43%)',
          name: 'Danger 04',
        },
        {
          token: 'danger-250',
          oklch:
            'oklch(0.8133068732197568 0.08452871651344564 18.398482771634782)',
          hex: '#f4acad',
          rgb: 'rgb(244, 172, 173)',
          hsl: 'hsl(359.39, 76.34%, 81.59%)',
        },
        {
          token: 'danger-300',
          oklch:
            'oklch(0.7513813413246784 0.1060760923804635 18.368790643843795)',
          hex: '#ea9294',
          rgb: 'rgb(234, 146, 148)',
          hsl: 'hsl(358.59, 67.4%, 74.56%)',
        },
        {
          token: 'danger-350',
          oklch:
            'oklch(0.6894558094295998 0.12762346824748136 18.339098516052807)',
          hex: '#df787c',
          rgb: 'rgb(223, 120, 124)',
          hsl: 'hsl(357.51, 61.52%, 67.27%)',
        },
        {
          token: 'danger-400',
          oklch:
            'oklch(0.6275302775345213 0.1491708441144992 18.30940638826182)',
          hex: '#d35d65',
          rgb: 'rgb(211, 93, 101)',
          hsl: 'hsl(355.93, 57.28%, 59.61%)',
          name: 'Danger 03',
        },
        {
          token: 'danger-450',
          oklch:
            'oklch(0.5961466901234453 0.1600594003984286 18.251840020312933)',
          hex: '#cd4e59',
          rgb: 'rgb(205, 78, 89)',
          hsl: 'hsl(354.77, 55.6%, 55.49%)',
        },
        {
          token: 'danger-500',
          oklch:
            'oklch(0.5647631027123693 0.17094795668235796 18.194273652364046)',
          hex: '#c63f4e',
          rgb: 'rgb(198, 63, 78)',
          hsl: 'hsl(353.23, 54.28%, 51.09%)',
        },
        {
          token: 'danger-550',
          oklch:
            'oklch(0.5333795153012932 0.1818365129662873 18.13670728441516)',
          hex: '#bf2c42',
          rgb: 'rgb(191, 44, 66)',
          hsl: 'hsl(350.97, 62.34%, 46.16%)',
        },
        {
          token: 'danger-600',
          oklch:
            'oklch(0.5019959278902173 0.19272506925021668 18.079140916466272)',
          hex: '#b81237',
          rgb: 'rgb(184, 18, 55)',
          hsl: 'hsl(346.63, 82.18%, 39.61%)',
          name: 'Danger 02',
        },
        {
          token: 'danger-650',
          oklch:
            'oklch(0.43761291207168196 0.16911051005163913 18.72632727121819)',
          hex: '#990b2a',
          rgb: 'rgb(153, 11, 42)',
          hsl: 'hsl(346.89, 86.15%, 32.28%)',
        },
        {
          token: 'danger-700',
          oklch:
            'oklch(0.3732298962531466 0.1454959508530616 19.3735136259701)',
          hex: '#7c061f',
          rgb: 'rgb(124, 6, 31)',
          hsl: 'hsl(347.25, 91.31%, 25.33%)',
        },
        {
          token: 'danger-750',
          oklch:
            'oklch(0.30884688043461134 0.12188139165448407 20.020699980722014)',
          hex: '#5f0214',
          rgb: 'rgb(95, 2, 20)',
          hsl: 'hsl(348.45, 96%, 19.02%)',
        },
        {
          token: 'danger-800',
          oklch:
            'oklch(0.244463864616076 0.09826683245590653 20.66788633547393)',
          hex: '#44000a',
          rgb: 'rgb(68, 0, 10)',
          hsl: 'hsl(351.18, 100%, 13.33%)',
          name: 'Danger 01',
        },
        {
          token: 'danger-850',
          oklch:
            'oklch(0.2016826883082627 0.08352680758752055 20.66788633547393)',
          hex: '#330005',
          rgb: 'rgb(51, 0, 5)',
          hsl: 'hsl(352.99, 100%, 9.85%)',
        },
        {
          token: 'danger-900',
          oklch:
            'oklch(0.15890151200044939 0.06878678271913458 20.66788633547393)',
          hex: '#230002',
          rgb: 'rgb(35, 0, 2)',
          hsl: 'hsl(354.47, 100%, 6.66%)',
        },
        {
          token: 'danger-950',
          oklch:
            'oklch(0.1161203356926361 0.0540467578507486 20.66788633547393)',
          hex: '#140001',
          rgb: 'rgb(20, 0, 1)',
          hsl: 'hsl(355.5, 100%, 3.76%)',
        },
      ],
    },
    info: {
      name: 'Info',
      colors: [
        {
          token: 'info-50',
          oklch:
            'oklch(0.9472470414070251 0.01319114316017373 261.49146551846417)',
          hex: '#e9eef7',
          rgb: 'rgb(233, 238, 247)',
          hsl: 'hsl(217.99, 45.88%, 94%)',
        },
        {
          token: 'info-100',
          oklch:
            'oklch(0.8944940828140502 0.02232347304029401 261.49146551846417)',
          hex: '#d4ddeb',
          rgb: 'rgb(212, 221, 235)',
          hsl: 'hsl(218, 37.47%, 87.77%)',
        },
        {
          token: 'info-150',
          oklch:
            'oklch(0.8417411242210754 0.03145580292041429 261.49146551846417)',
          hex: '#c0cce0',
          rgb: 'rgb(192, 204, 224)',
          hsl: 'hsl(218.02, 34.49%, 81.6%)',
        },
        {
          token: 'info-200',
          oklch:
            'oklch(0.7889881656281005 0.04058813280053457 261.49146551846417)',
          hex: '#acbbd5',
          rgb: 'rgb(172, 187, 213)',
          hsl: 'hsl(218.05, 32.8%, 75.49%)',
          name: 'Info 04',
        },
        {
          token: 'info-250',
          oklch:
            'oklch(0.7327975333484203 0.05432284288357939 261.7505460408388)',
          hex: '#96a9cc',
          rgb: 'rgb(150, 169, 204)',
          hsl: 'hsl(218.29, 34.23%, 69.31%)',
        },
        {
          token: 'info-300',
          oklch:
            'oklch(0.6766069010687401 0.06805755296662422 262.0096265632134)',
          hex: '#8098c2',
          rgb: 'rgb(128, 152, 194)',
          hsl: 'hsl(218.57, 34.87%, 63.2%)',
        },
        {
          token: 'info-350',
          oklch: 'oklch(0.62041626878906 0.08179226304966905 262.268707085588)',
          hex: '#6b86b8',
          rgb: 'rgb(107, 134, 184)',
          hsl: 'hsl(218.9, 35.05%, 57.15%)',
        },
        {
          token: 'info-400',
          oklch:
            'oklch(0.5642256365093798 0.09552697313271387 262.52778760796264)',
          hex: '#5775ae',
          rgb: 'rgb(87, 117, 174)',
          hsl: 'hsl(219.31, 34.94%, 51.18%)',
          name: 'Info 03',
        },
        {
          token: 'info-450',
          oklch:
            'oklch(0.5358247299257868 0.10246599429811404 262.4837143651888)',
          hex: '#4d6ca9',
          rgb: 'rgb(77, 108, 169)',
          hsl: 'hsl(219.41, 37.55%, 48.13%)',
        },
        {
          token: 'info-500',
          oklch:
            'oklch(0.5074238233421937 0.10940501546351422 262.4396411224149)',
          hex: '#4264a4',
          rgb: 'rgb(66, 100, 164)',
          hsl: 'hsl(219.52, 42.28%, 45.1%)',
        },
        {
          token: 'info-550',
          oklch:
            'oklch(0.47902291675860065 0.1163440366289144 262.395567879641)',
          hex: '#385b9e',
          rgb: 'rgb(56, 91, 158)',
          hsl: 'hsl(219.66, 47.62%, 42.06%)',
        },
        {
          token: 'info-600',
          oklch:
            'oklch(0.4506220101750076 0.12328305779431457 262.3514946368672)',
          hex: '#2e5299',
          rgb: 'rgb(46, 82, 153)',
          hsl: 'hsl(219.81, 53.77%, 39.02%)',
          name: 'Info 02',
        },
        {
          token: 'info-650',
          oklch:
            'oklch(0.3914472612047992 0.10948475002303204 262.3659717757216)',
          hex: '#23427f',
          rgb: 'rgb(35, 66, 127)',
          hsl: 'hsl(219.87, 56.39%, 31.92%)',
        },
        {
          token: 'info-700',
          oklch:
            'oklch(0.33227251223459087 0.09568644225174952 262.3804489145761)',
          hex: '#193366',
          rgb: 'rgb(25, 51, 102)',
          hsl: 'hsl(219.93, 60.27%, 25.07%)',
        },
        {
          token: 'info-750',
          oklch:
            'oklch(0.2730977632643825 0.08188813448046699 262.3949260534306)',
          hex: '#10254f',
          rgb: 'rgb(16, 37, 79)',
          hsl: 'hsl(220.02, 66.59%, 18.51%)',
        },
        {
          token: 'info-800',
          oklch:
            'oklch(0.21392301429417415 0.06808982670918445 262.409403192285)',
          hex: '#071738',
          rgb: 'rgb(7, 23, 56)',
          hsl: 'hsl(220.41, 77.78%, 12.35%)',
          name: 'Info 01',
        },
        {
          token: 'info-850',
          oklch:
            'oklch(0.1764864867926937 0.057876352702806784 262.409403192285)',
          hex: '#040f2a',
          rgb: 'rgb(4, 15, 42)',
          hsl: 'hsl(222.21, 84%, 8.9%)',
        },
        {
          token: 'info-900',
          oklch:
            'oklch(0.13904995929121322 0.047662878696429115 262.409403192285)',
          hex: '#02071c',
          rgb: 'rgb(2, 7, 28)',
          hsl: 'hsl(226.63, 89.54%, 5.83%)',
        },
        {
          token: 'info-950',
          oklch:
            'oklch(0.10161343178973273 0.03744940469005145 262.409403192285)',
          hex: '#00030f',
          rgb: 'rgb(0, 3, 15)',
          hsl: 'hsl(230.65, 94.13%, 3.12%)',
        },
      ],
    },
  },
  sequential: {
    ember: {
      name: 'Ember',
      colors: [
        {
          token: 'ember-50',
          oklch:
            'oklch(0.26941250914562653 0.010359980410804477 242.08386480750661)',
          hex: '#22272b',
          rgb: 'rgb(34, 39, 43)',
          hsl: 'hsl(206.67, 11.69%, 15.1%)',
          name: 'NSW Grey 01',
        },
        {
          token: 'ember-100',
          oklch:
            'oklch(0.28008157601578276 0.038070598867272605 254.21354645332488)',
          hex: '#1c2a3b',
          rgb: 'rgb(28, 42, 59)',
          hsl: 'hsl(213.18, 36.6%, 17.05%)',
        },
        {
          token: 'ember-150',
          oklch:
            'oklch(0.29075064288593905 0.06578121732374073 266.3432280991432)',
          hex: '#1c2a4c',
          rgb: 'rgb(28, 42, 76)',
          hsl: 'hsl(223.18, 45.97%, 20.45%)',
        },
        {
          token: 'ember-200',
          oklch:
            'oklch(0.3014197097560953 0.09349183578020887 278.47290974496144)',
          hex: '#25265c',
          rgb: 'rgb(37, 38, 92)',
          hsl: 'hsl(239.01, 42.17%, 25.25%)',
        },
        {
          token: 'ember-250',
          oklch:
            'oklch(0.31208877662625156 0.121202454236677 290.6025913907797)',
          hex: '#331f68',
          rgb: 'rgb(51, 31, 104)',
          hsl: 'hsl(256.92, 54.38%, 26.43%)',
        },
        {
          token: 'ember-300',
          oklch:
            'oklch(0.3227578434964078 0.1489130726931451 302.732273036598)',
          hex: '#441170',
          rgb: 'rgb(68, 17, 112)',
          hsl: 'hsl(272.21, 73.64%, 25.29%)',
          name: 'NSW Purple 01',
        },
        {
          token: 'ember-350',
          oklch:
            'oklch(0.37059735908503444 0.16263146044053944 318.25253033835594)',
          hex: '#611175',
          rgb: 'rgb(97, 17, 117)',
          hsl: 'hsl(288.04, 74.47%, 26.34%)',
        },
        {
          token: 'ember-400',
          oklch:
            'oklch(0.4184368746736611 0.17634984818793376 333.7727876401139)',
          hex: '#800f73',
          rgb: 'rgb(128, 15, 115)',
          hsl: 'hsl(306.7, 79.36%, 27.95%)',
        },
        {
          token: 'ember-450',
          oklch:
            'oklch(0.46627639026228773 0.1900682359353281 349.2930449418719)',
          hex: '#9f096a',
          rgb: 'rgb(159, 9, 106)',
          hsl: 'hsl(321.29, 89.06%, 32.91%)',
        },
        {
          token: 'ember-500',
          oklch:
            'oklch(0.5141159058509144 0.20378662368272243 364.8133022436299)',
          hex: '#bc0758',
          rgb: 'rgb(188, 7, 88)',
          hsl: 'hsl(333.21, 93.02%, 38.26%)',
        },
        {
          token: 'ember-550',
          oklch:
            'oklch(0.561955421439541 0.21750501143011675 380.33355954538786)',
          hex: '#d7153a',
          rgb: 'rgb(215, 21, 58)',
          hsl: 'hsl(348.56, 82.2%, 46.27%)',
          name: 'NSW Red 02',
        },
        {
          token: 'ember-600',
          oklch:
            'oklch(0.5844471096439127 0.2124898578932087 24.69646414455863)',
          hex: '#de2b34',
          rgb: 'rgb(222, 43, 52)',
          hsl: 'hsl(356.81, 72.88%, 51.81%)',
        },
        {
          token: 'ember-650',
          oklch:
            'oklch(0.6069387978482844 0.20747470435630064 29.059368743729372)',
          hex: '#e43b2e',
          rgb: 'rgb(228, 59, 46)',
          hsl: 'hsl(4.24, 76.99%, 53.66%)',
        },
        {
          token: 'ember-700',
          oklch:
            'oklch(0.6294304860526561 0.2024595508193926 33.42227334290012)',
          hex: '#e94927',
          rgb: 'rgb(233, 73, 39)',
          hsl: 'hsl(10.37, 81.79%, 53.5%)',
        },
        {
          token: 'ember-750',
          oklch:
            'oklch(0.6519221742570278 0.19744439728248453 37.78517794207087)',
          hex: '#ee5621',
          rgb: 'rgb(238, 86, 33)',
          hsl: 'hsl(15.55, 86.14%, 53.23%)',
        },
        {
          token: 'ember-800',
          oklch:
            'oklch(0.6744138624613994 0.1924292437455765 42.148082541241614)',
          hex: '#f3631b',
          rgb: 'rgb(243, 99, 27)',
          hsl: 'hsl(20, 90%, 52.94%)',
          name: 'NSW Orange 02',
        },
        {
          token: 'ember-850',
          oklch:
            'oklch(0.7005386161572219 0.1874149612588774 49.23658619567631)',
          hex: '#f77300',
          rgb: 'rgb(247, 115, 0)',
          hsl: 'hsl(27.92, 100%, 48.28%)',
        },
        {
          token: 'ember-900',
          oklch:
            'oklch(0.7266633698530445 0.18240067877217833 56.32508985011101)',
          hex: '#f98200',
          rgb: 'rgb(249, 130, 0)',
          hsl: 'hsl(33.52, 100%, 44.71%)',
        },
        {
          token: 'ember-950',
          oklch:
            'oklch(0.7527881235488669 0.17738639628547925 63.41359350454571)',
          hex: '#fb9100',
          rgb: 'rgb(251, 145, 0)',
          hsl: 'hsl(37.15, 100%, 43.96%)',
        },
        {
          token: 'ember-1000',
          oklch:
            'oklch(0.7789128772446895 0.17237211379878017 70.5020971589804)',
          hex: '#fba000',
          rgb: 'rgb(251, 160, 0)',
          hsl: 'hsl(40.05, 100%, 44.88%)',
        },
        {
          token: 'ember-1050',
          oklch:
            'oklch(0.805037630940512 0.1673578313120811 77.59060081341511)',
          hex: '#faaf05',
          rgb: 'rgb(250, 175, 5)',
          hsl: 'hsl(41.63, 96.08%, 50%)',
          name: 'NSW Yellow 02',
        },
      ],
    },
    earthfire: {
      name: 'Earthfire',
      colors: [
        {
          token: 'earthfire-50',
          oklch:
            'oklch(0.3613609992214239 0.05850633759649848 66.9201446671023)',
          hex: '#523719',
          rgb: 'rgb(82, 55, 25)',
          hsl: 'hsl(31.58, 53.27%, 20.98%)',
          name: 'NSW Brown 01',
        },
        {
          token: 'earthfire-100',
          oklch:
            'oklch(0.375528629961059 0.07868078002461537 60.14060364356939)',
          hex: '#5f360d',
          rgb: 'rgb(95, 54, 13)',
          hsl: 'hsl(29.83, 75.96%, 21.14%)',
        },
        {
          token: 'earthfire-150',
          oklch:
            'oklch(0.38969626070069413 0.09885522245273226 53.361062620036485)',
          hex: '#6c3300',
          rgb: 'rgb(108, 51, 0)',
          hsl: 'hsl(28.29, 100%, 21.11%)',
        },
        {
          token: 'earthfire-200',
          oklch:
            'oklch(0.4038638914403292 0.11902966488084912 46.58152159650358)',
          hex: '#7a2e00',
          rgb: 'rgb(122, 46, 0)',
          hsl: 'hsl(25.01, 100%, 22.21%)',
        },
        {
          token: 'earthfire-250',
          oklch:
            'oklch(0.4180315221799643 0.13920410730896604 39.80198057297066)',
          hex: '#872600',
          rgb: 'rgb(135, 38, 0)',
          hsl: 'hsl(19.74, 100%, 24.72%)',
        },
        {
          token: 'earthfire-300',
          oklch:
            'oklch(0.4321991529195994 0.1593785497370829 33.022439549437756)',
          hex: '#941b00',
          rgb: 'rgb(148, 27, 0)',
          hsl: 'hsl(10.95, 100%, 29.02%)',
          name: 'NSW Orange 01',
        },
        {
          token: 'earthfire-350',
          oklch:
            'oklch(0.48064209482795944 0.16598868853878163 34.847568147798526)',
          hex: '#a72a05',
          rgb: 'rgb(167, 42, 5)',
          hsl: 'hsl(13.86, 94.5%, 33.59%)',
        },
        {
          token: 'earthfire-400',
          oklch:
            'oklch(0.5290850367363195 0.17259882734048035 36.672696746159296)',
          hex: '#b9380b',
          rgb: 'rgb(185, 56, 11)',
          hsl: 'hsl(15.67, 89.02%, 38.48%)',
        },
        {
          token: 'earthfire-450',
          oklch:
            'oklch(0.5775279786446794 0.17920896614217904 38.49782534452007)',
          hex: '#cc4611',
          rgb: 'rgb(204, 70, 17)',
          hsl: 'hsl(17.17, 84.85%, 43.38%)',
        },
        {
          token: 'earthfire-500',
          oklch:
            'oklch(0.6259709205530395 0.18581910494387777 40.322953942880844)',
          hex: '#e05516',
          rgb: 'rgb(224, 85, 22)',
          hsl: 'hsl(18.62, 82.01%, 48.19%)',
        },
        {
          token: 'earthfire-550',
          oklch:
            'oklch(0.6744138624613994 0.1924292437455765 42.148082541241614)',
          hex: '#f3631b',
          rgb: 'rgb(243, 99, 27)',
          hsl: 'hsl(20, 90%, 52.94%)',
          name: 'NSW Orange 02',
        },
        {
          token: 'earthfire-600',
          oklch:
            'oklch(0.7005386161572219 0.1874149612588774 49.23658619567631)',
          hex: '#f77300',
          rgb: 'rgb(247, 115, 0)',
          hsl: 'hsl(27.92, 100%, 48.28%)',
        },
        {
          token: 'earthfire-650',
          oklch:
            'oklch(0.7266633698530445 0.18240067877217833 56.32508985011101)',
          hex: '#f98200',
          rgb: 'rgb(249, 130, 0)',
          hsl: 'hsl(33.52, 100%, 44.71%)',
        },
        {
          token: 'earthfire-700',
          oklch:
            'oklch(0.7527881235488669 0.17738639628547925 63.41359350454571)',
          hex: '#fb9100',
          rgb: 'rgb(251, 145, 0)',
          hsl: 'hsl(37.15, 100%, 43.96%)',
        },
        {
          token: 'earthfire-750',
          oklch:
            'oklch(0.7789128772446895 0.17237211379878017 70.5020971589804)',
          hex: '#fba000',
          rgb: 'rgb(251, 160, 0)',
          hsl: 'hsl(40.05, 100%, 44.88%)',
        },
        {
          token: 'earthfire-800',
          oklch:
            'oklch(0.805037630940512 0.1673578313120811 77.59060081341511)',
          hex: '#faaf05',
          rgb: 'rgb(250, 175, 5)',
          hsl: 'hsl(41.63, 96.08%, 50%)',
          name: 'NSW Yellow 02',
        },
        {
          token: 'earthfire-850',
          oklch:
            'oklch(0.8297809709649343 0.1536949679676753 80.88019785042881)',
          hex: '#fabb3b',
          rgb: 'rgb(250, 187, 59)',
          hsl: 'hsl(40.33, 95.01%, 60.5%)',
        },
        {
          token: 'earthfire-900',
          oklch:
            'oklch(0.8545243109893567 0.14003210462326948 84.1697948874425)',
          hex: '#fac757',
          rgb: 'rgb(250, 199, 87)',
          hsl: 'hsl(41.17, 94.37%, 66.1%)',
        },
        {
          token: 'earthfire-950',
          oklch:
            'oklch(0.879267651013779 0.12636924127886368 87.45939192445621)',
          hex: '#fbd26f',
          rgb: 'rgb(251, 210, 111)',
          hsl: 'hsl(42.6, 94.08%, 70.89%)',
        },
        {
          token: 'earthfire-1000',
          oklch:
            'oklch(0.9040109910382014 0.11270637793445784 90.7489889614699)',
          hex: '#fcdd85',
          rgb: 'rgb(252, 221, 133)',
          hsl: 'hsl(44.45, 94.44%, 75.39%)',
        },
        {
          token: 'earthfire-1050',
          oklch:
            'oklch(0.9287543310626237 0.09904351459005203 94.03858599848361)',
          hex: '#fde79a',
          rgb: 'rgb(253, 231, 154)',
          hsl: 'hsl(46.67, 96.12%, 79.8%)',
          name: 'NSW Yellow 03',
        },
      ],
    },
    'fuchsia heat': {
      name: 'Fuchsia Heat',
      colors: [
        {
          token: 'fuchsia-heat-50',
          oklch:
            'oklch(0.340575889122065 0.14685114320973375 341.7061446429382)',
          hex: '#65004d',
          rgb: 'rgb(101, 0, 77)',
          hsl: 'hsl(314.26, 100%, 19.8%)',
          name: 'NSW Fuchsia 01',
        },
        {
          token: 'fuchsia-heat-100',
          oklch:
            'oklch(0.39271137664696126 0.16832751251930148 341.41537719439964)',
          hex: '#7b025f',
          rgb: 'rgb(123, 2, 95)',
          hsl: 'hsl(313.81, 97.5%, 24.42%)',
        },
        {
          token: 'fuchsia-heat-150',
          oklch:
            'oklch(0.4448468641718576 0.1898038818288692 341.12460974586105)',
          hex: '#920472',
          rgb: 'rgb(146, 4, 114)',
          hsl: 'hsl(313.5, 94.54%, 29.35%)',
        },
        {
          token: 'fuchsia-heat-200',
          oklch:
            'oklch(0.49698235169675387 0.2112802511384369 340.8338422973224)',
          hex: '#a90885',
          rgb: 'rgb(169, 8, 133)',
          hsl: 'hsl(313.28, 91.15%, 34.65%)',
        },
        {
          token: 'fuchsia-heat-250',
          oklch:
            'oklch(0.5491178392216501 0.23275662044800466 340.5430748487838)',
          hex: '#c10d99',
          rgb: 'rgb(193, 13, 153)',
          hsl: 'hsl(313.13, 87.55%, 40.29%)',
        },
        {
          token: 'fuchsia-heat-300',
          oklch:
            'oklch(0.6012533267465464 0.25423298975757236 340.25230740024523)',
          hex: '#d912ae',
          rgb: 'rgb(217, 18, 174)',
          hsl: 'hsl(312.96, 84.68%, 46.08%)',
          name: 'NSW Fuchsia 02',
        },
        {
          token: 'fuchsia-heat-350',
          oklch:
            'oklch(0.615885433889517 0.24187224055517317 352.6314624284445)',
          hex: '#e61e92',
          rgb: 'rgb(230, 30, 146)',
          hsl: 'hsl(325.17, 80.36%, 50.99%)',
        },
        {
          token: 'fuchsia-heat-400',
          oklch:
            'oklch(0.6305175410324876 0.22951149135277402 365.0106174566438)',
          hex: '#f02d77',
          rgb: 'rgb(240, 45, 119)',
          hsl: 'hsl(337.28, 86.52%, 55.78%)',
        },
        {
          token: 'fuchsia-heat-450',
          oklch:
            'oklch(0.6451496481754583 0.21715074215037483 377.38977248484304)',
          hex: '#f53e5b',
          rgb: 'rgb(245, 62, 91)',
          hsl: 'hsl(350.5, 90.09%, 60.17%)',
        },
        {
          token: 'fuchsia-heat-500',
          oklch:
            'oklch(0.6597817553184289 0.20478999294797567 389.76892751304234)',
          hex: '#f6503e',
          rgb: 'rgb(246, 80, 62)',
          hsl: 'hsl(5.94, 91.01%, 60.41%)',
        },
        {
          token: 'fuchsia-heat-550',
          oklch:
            'oklch(0.6744138624613994 0.1924292437455765 402.1480825412416)',
          hex: '#f3631b',
          rgb: 'rgb(243, 99, 27)',
          hsl: 'hsl(20, 90%, 52.94%)',
          name: 'NSW Orange 02',
        },
        {
          token: 'fuchsia-heat-600',
          oklch:
            'oklch(0.7005386161572219 0.1874149612588774 49.23658619567631)',
          hex: '#f77300',
          rgb: 'rgb(247, 115, 0)',
          hsl: 'hsl(27.92, 100%, 48.28%)',
        },
        {
          token: 'fuchsia-heat-650',
          oklch:
            'oklch(0.7266633698530445 0.18240067877217833 56.32508985011101)',
          hex: '#f98200',
          rgb: 'rgb(249, 130, 0)',
          hsl: 'hsl(33.52, 100%, 44.71%)',
        },
        {
          token: 'fuchsia-heat-700',
          oklch:
            'oklch(0.7527881235488669 0.17738639628547925 63.41359350454571)',
          hex: '#fb9100',
          rgb: 'rgb(251, 145, 0)',
          hsl: 'hsl(37.15, 100%, 43.96%)',
        },
        {
          token: 'fuchsia-heat-750',
          oklch:
            'oklch(0.7789128772446895 0.17237211379878017 70.5020971589804)',
          hex: '#fba000',
          rgb: 'rgb(251, 160, 0)',
          hsl: 'hsl(40.05, 100%, 44.88%)',
        },
        {
          token: 'fuchsia-heat-800',
          oklch:
            'oklch(0.805037630940512 0.1673578313120811 77.59060081341511)',
          hex: '#faaf05',
          rgb: 'rgb(250, 175, 5)',
          hsl: 'hsl(41.63, 96.08%, 50%)',
          name: 'NSW Yellow 02',
        },
        {
          token: 'fuchsia-heat-850',
          oklch:
            'oklch(0.8297809709649343 0.1536949679676753 80.88019785042881)',
          hex: '#fabb3b',
          rgb: 'rgb(250, 187, 59)',
          hsl: 'hsl(40.33, 95.01%, 60.5%)',
        },
        {
          token: 'fuchsia-heat-900',
          oklch:
            'oklch(0.8545243109893567 0.14003210462326948 84.1697948874425)',
          hex: '#fac757',
          rgb: 'rgb(250, 199, 87)',
          hsl: 'hsl(41.17, 94.37%, 66.1%)',
        },
        {
          token: 'fuchsia-heat-950',
          oklch:
            'oklch(0.879267651013779 0.12636924127886368 87.45939192445621)',
          hex: '#fbd26f',
          rgb: 'rgb(251, 210, 111)',
          hsl: 'hsl(42.6, 94.08%, 70.89%)',
        },
        {
          token: 'fuchsia-heat-1000',
          oklch:
            'oklch(0.9040109910382014 0.11270637793445784 90.7489889614699)',
          hex: '#fcdd85',
          rgb: 'rgb(252, 221, 133)',
          hsl: 'hsl(44.45, 94.44%, 75.39%)',
        },
        {
          token: 'fuchsia-heat-1050',
          oklch:
            'oklch(0.9287543310626237 0.09904351459005203 94.03858599848361)',
          hex: '#fde79a',
          rgb: 'rgb(253, 231, 154)',
          hsl: 'hsl(46.67, 96.12%, 79.8%)',
          name: 'NSW Yellow 03',
        },
      ],
    },
    'polar-glow': {
      name: 'Polar Glow',
      colors: [
        {
          token: 'polar-glow-50',
          oklch:
            'oklch(0.28999868761296915 0.11729575493611505 259.8419383518128)',
          hex: '#002664',
          rgb: 'rgb(0, 38, 100)',
          hsl: 'hsl(217.2, 100%, 19.61%)',
          name: 'NSW Blue 01',
        },
        {
          token: 'polar-glow-100',
          oklch:
            'oklch(0.34702148121110205 0.1398033340019479 260.02481761921945)',
          hex: '#013380',
          rgb: 'rgb(1, 51, 128)',
          hsl: 'hsl(216.47, 98.23%, 25.41%)',
        },
        {
          token: 'polar-glow-150',
          oklch:
            'oklch(0.404044274809235 0.16231091306778073 260.20769688662614)',
          hex: '#03419e',
          rgb: 'rgb(3, 65, 158)',
          hsl: 'hsl(216.25, 95.7%, 31.67%)',
        },
        {
          token: 'polar-glow-200',
          oklch:
            'oklch(0.4610670684073679 0.18481849213361357 260.3905761540328)',
          hex: '#074fbd',
          rgb: 'rgb(7, 79, 189)',
          hsl: 'hsl(216.42, 92.38%, 38.48%)',
        },
        {
          token: 'polar-glow-250',
          oklch:
            'oklch(0.5180898620055008 0.2073260711994464 260.57345542143946)',
          hex: '#0d5ddc',
          rgb: 'rgb(13, 93, 220)',
          hsl: 'hsl(216.89, 88.51%, 45.86%)',
        },
        {
          token: 'polar-glow-300',
          oklch:
            'oklch(0.5751126556036337 0.22983365026527922 260.7563346888461)',
          hex: '#146cfd',
          rgb: 'rgb(20, 108, 253)',
          hsl: 'hsl(217.34, 98.31%, 53.53%)',
          name: 'NSW Blue 02',
        },
        {
          token: 'polar-glow-350',
          oklch:
            'oklch(0.5714061327954376 0.19990429396873818 250.7825946981967)',
          hex: '#0077e7',
          rgb: 'rgb(0, 119, 231)',
          hsl: 'hsl(204.09, 100%, 35.98%)',
        },
        {
          token: 'polar-glow-400',
          oklch:
            'oklch(0.5676996099872416 0.16997493767219712 240.8088547075473)',
          hex: '#007ed0',
          rgb: 'rgb(0, 126, 208)',
          hsl: 'hsl(198.32, 100%, 29.23%)',
        },
        {
          token: 'polar-glow-450',
          oklch:
            'oklch(0.5639930871790456 0.1400455813756561 230.83511471689792)',
          hex: '#0082b8',
          rgb: 'rgb(0, 130, 184)',
          hsl: 'hsl(193.65, 100%, 25.57%)',
        },
        {
          token: 'polar-glow-500',
          oklch:
            'oklch(0.5602865643708496 0.11011622507911506 220.8613747262485)',
          hex: '#0082a2',
          rgb: 'rgb(0, 130, 162)',
          hsl: 'hsl(189.91, 100%, 26.21%)',
        },
        {
          token: 'polar-glow-550',
          oklch:
            'oklch(0.5565800415626535 0.08018686878257403 210.8876347355991)',
          hex: '#2e808e',
          rgb: 'rgb(46, 128, 142)',
          hsl: 'hsl(188.75, 51.06%, 36.86%)',
          name: 'NSW Teal 02',
        },
        {
          token: 'polar-glow-600',
          oklch:
            'oklch(0.614045385775663 0.07989207999038019 209.90435426372622)',
          hex: '#42929f',
          rgb: 'rgb(66, 146, 159)',
          hsl: 'hsl(188.56, 41.5%, 44.02%)',
        },
        {
          token: 'polar-glow-650',
          oklch:
            'oklch(0.6715107299886726 0.07959729119818636 208.92107379185333)',
          hex: '#54a3b0',
          rgb: 'rgb(84, 163, 176)',
          hsl: 'hsl(188.21, 36.66%, 51.05%)',
        },
        {
          token: 'polar-glow-700',
          oklch:
            'oklch(0.728976074201682 0.07930250240599251 207.93779331998044)',
          hex: '#67b6c1',
          rgb: 'rgb(103, 182, 193)',
          hsl: 'hsl(187.78, 42.32%, 58.09%)',
        },
        {
          token: 'polar-glow-750',
          oklch:
            'oklch(0.7864414184146915 0.07900771361379869 206.95451284810756)',
          hex: '#79c8d3',
          rgb: 'rgb(121, 200, 211)',
          hsl: 'hsl(187.28, 50.49%, 65.18%)',
        },
        {
          token: 'polar-glow-800',
          oklch:
            'oklch(0.843906762627701 0.07871292482160484 205.97123237623467)',
          hex: '#8cdbe5',
          rgb: 'rgb(140, 219, 229)',
          hsl: 'hsl(186.74, 63.12%, 72.35%)',
          name: 'NSW Teal 03',
        },
        {
          token: 'polar-glow-850',
          oklch:
            'oklch(0.8605191598756461 0.06913623040762773 202.09457902880814)',
          hex: '#9adfe5',
          rgb: 'rgb(154, 223, 229)',
          hsl: 'hsl(184.33, 58.39%, 75.1%)',
        },
        {
          token: 'polar-glow-900',
          oklch:
            'oklch(0.8771315571235911 0.0595595359936506 198.21792568138164)',
          hex: '#a9e3e5',
          rgb: 'rgb(169, 227, 229)',
          hsl: 'hsl(181.58, 53.48%, 77.91%)',
        },
        {
          token: 'polar-glow-950',
          oklch:
            'oklch(0.8937439543715363 0.04998284157967349 194.34127233395512)',
          hex: '#b6e7e6',
          rgb: 'rgb(182, 231, 230)',
          hsl: 'hsl(178.46, 50.29%, 81.05%)',
        },
        {
          token: 'polar-glow-1000',
          oklch:
            'oklch(0.9103563516194814 0.04040614716569636 190.46461898652862)',
          hex: '#c4ebe7',
          rgb: 'rgb(196, 235, 231)',
          hsl: 'hsl(175.16, 48.63%, 84.4%)',
        },
        {
          token: 'polar-glow-1050',
          oklch:
            'oklch(0.9269687488674264 0.03082945275171925 186.5879656391021)',
          hex: '#d1eeea',
          rgb: 'rgb(209, 238, 234)',
          hsl: 'hsl(171.72, 46.03%, 87.65%)',
          name: 'NSW Teal 04',
        },
      ],
    },
    'glacier-pool': {
      name: 'Glacier Pool',
      colors: [
        {
          token: 'glacier-pool-50',
          oklch:
            'oklch(0.3227578434964078 0.1489130726931451 302.732273036598)',
          hex: '#441170',
          rgb: 'rgb(68, 17, 112)',
          hsl: 'hsl(272.21, 73.64%, 25.29%)',
          name: 'NSW Purple 01',
        },
        {
          token: 'glacier-pool-100',
          oklch:
            'oklch(0.37455225184473395 0.16345336471971228 300.286155081269)',
          hex: '#511e88',
          rgb: 'rgb(81, 30, 136)',
          hsl: 'hsl(268.82, 63.8%, 32.55%)',
        },
        {
          token: 'glacier-pool-150',
          oklch:
            'oklch(0.42634666019306017 0.17799365674627945 297.84003712594)',
          hex: '#5d2ba1',
          rgb: 'rgb(93, 43, 161)',
          hsl: 'hsl(265.66, 57.74%, 40%)',
        },
        {
          token: 'glacier-pool-200',
          oklch:
            'oklch(0.4781410685413863 0.1925339487728466 295.39391917061107)',
          hex: '#6a39bb',
          rgb: 'rgb(106, 57, 187)',
          hsl: 'hsl(262.59, 53.52%, 47.71%)',
        },
        {
          token: 'glacier-pool-250',
          oklch:
            'oklch(0.5299354768897125 0.20707424079941378 292.9478012152821)',
          hex: '#7546d6',
          rgb: 'rgb(117, 70, 214)',
          hsl: 'hsl(259.57, 63.29%, 55.69%)',
        },
        {
          token: 'glacier-pool-300',
          oklch:
            'oklch(0.5817298852380387 0.22161453282598095 290.5016832599531)',
          hex: '#8055f1',
          rgb: 'rgb(128, 85, 241)',
          hsl: 'hsl(256.54, 84.78%, 63.92%)',
          name: 'NSW Purple 02',
        },
        {
          token: 'glacier-pool-350',
          oklch:
            'oklch(0.5804064393111577 0.2232583563138406 284.5526135457317)',
          hex: '#7359f6',
          rgb: 'rgb(115, 89, 246)',
          hsl: 'hsl(249.87, 89.68%, 65.72%)',
        },
        {
          token: 'glacier-pool-400',
          oklch:
            'oklch(0.5790829933842767 0.22490217980170027 278.6035438315103)',
          hex: '#645efa',
          rgb: 'rgb(100, 94, 250)',
          hsl: 'hsl(242.54, 93.67%, 67.32%)',
        },
        {
          token: 'glacier-pool-450',
          oklch:
            'oklch(0.5777595474573957 0.2265460032895599 272.6544741172889)',
          hex: '#5362fc',
          rgb: 'rgb(83, 98, 252)',
          hsl: 'hsl(234.52, 96.78%, 65.68%)',
        },
        {
          token: 'glacier-pool-500',
          oklch:
            'oklch(0.5764361015305147 0.22818982677741956 266.7054044030675)',
          hex: '#3c67fd',
          rgb: 'rgb(60, 103, 253)',
          hsl: 'hsl(226.71, 98.25%, 61.49%)',
        },
        {
          token: 'glacier-pool-550',
          oklch:
            'oklch(0.5751126556036337 0.22983365026527922 260.7563346888461)',
          hex: '#146cfd',
          rgb: 'rgb(20, 108, 253)',
          hsl: 'hsl(217.34, 98.31%, 53.53%)',
          name: 'NSW Blue 02',
        },
        {
          token: 'glacier-pool-600',
          oklch:
            'oklch(0.6329084041312646 0.20229545991836423 253.324100552745)',
          hex: '#0089ff',
          rgb: 'rgb(0, 137, 255)',
          hsl: 'hsl(206.24, 100%, 47%)',
        },
        {
          token: 'glacier-pool-650',
          oklch:
            'oklch(0.6907041526588955 0.17475726957144927 245.8918664166439)',
          hex: '#0ca2ff',
          rgb: 'rgb(12, 162, 255)',
          hsl: 'hsl(203.05, 100%, 52.55%)',
        },
        {
          token: 'glacier-pool-700',
          oklch:
            'oklch(0.7484999011865263 0.1472190792245343 238.45963228054276)',
          hex: '#3bb9ff',
          rgb: 'rgb(59, 185, 255)',
          hsl: 'hsl(201.53, 100%, 61.68%)',
        },
        {
          token: 'glacier-pool-750',
          oklch:
            'oklch(0.8062956497141572 0.11968088887761932 231.02739814444166)',
          hex: '#64cdff',
          rgb: 'rgb(100, 205, 255)',
          hsl: 'hsl(199.08, 99.69%, 69.52%)',
        },
        {
          token: 'glacier-pool-800',
          oklch:
            'oklch(0.8640913982417882 0.09214269853070436 223.59516400834056)',
          hex: '#8ce0ff',
          rgb: 'rgb(140, 224, 255)',
          hsl: 'hsl(196.17, 100%, 77.45%)',
          name: 'NSW Blue 03',
        },
        {
          token: 'glacier-pool-850',
          oklch:
            'oklch(0.876607835646608 0.08204682871763162 224.45428856710376)',
          hex: '#9ae3ff',
          rgb: 'rgb(154, 227, 255)',
          hsl: 'hsl(196.84, 99.95%, 80.17%)',
        },
        {
          token: 'glacier-pool-900',
          oklch:
            'oklch(0.8891242730514279 0.07195095890455891 225.31341312586693)',
          hex: '#a7e5ff',
          rgb: 'rgb(167, 229, 255)',
          hsl: 'hsl(197.46, 99.46%, 82.69%)',
        },
        {
          token: 'glacier-pool-950',
          oklch:
            'oklch(0.9016407104562478 0.06185508909148618 226.17253768463013)',
          hex: '#b3e8fe',
          rgb: 'rgb(179, 232, 254)',
          hsl: 'hsl(198.06, 98.33%, 85.06%)',
        },
        {
          token: 'glacier-pool-1000',
          oklch:
            'oklch(0.9141571478610677 0.05175921927841346 227.0316622433933)',
          hex: '#bfeafe',
          rgb: 'rgb(191, 234, 254)',
          hsl: 'hsl(198.64, 96.23%, 87.29%)',
        },
        {
          token: 'glacier-pool-1050',
          oklch:
            'oklch(0.9266735852658876 0.04166334946534074 227.8907868021565)',
          hex: '#cbedfd',
          rgb: 'rgb(203, 237, 253)',
          hsl: 'hsl(199.2, 92.59%, 89.41%)',
          name: 'NSW Blue 04',
        },
      ],
    },
    'deep-current': {
      name: 'Deep Current',
      colors: [
        {
          token: 'deep-current-50',
          oklch:
            'oklch(0.33911919741392443 0.053288133195211605 210.30348176697262)',
          hex: '#0b3f47',
          rgb: 'rgb(11, 63, 71)',
          hsl: 'hsl(188, 73.17%, 16.08%)',
          name: 'NSW Teal 01',
        },
        {
          token: 'deep-current-100',
          oklch:
            'oklch(0.38261136624367026 0.05866788031268409 210.42031236069792)',
          hex: '#124b54',
          rgb: 'rgb(18, 75, 84)',
          hsl: 'hsl(188.21, 65.12%, 20.06%)',
        },
        {
          token: 'deep-current-150',
          oklch:
            'oklch(0.4261035350734161 0.06404762743015657 210.53714295442322)',
          hex: '#195862',
          rgb: 'rgb(25, 88, 98)',
          hsl: 'hsl(188.38, 59.83%, 24.13%)',
        },
        {
          token: 'deep-current-200',
          oklch:
            'oklch(0.46959570390316185 0.06942737454762905 210.6539735481485)',
          hex: '#206571',
          rgb: 'rgb(32, 101, 113)',
          hsl: 'hsl(188.52, 56.06%, 28.28%)',
        },
        {
          token: 'deep-current-250',
          oklch:
            'oklch(0.5130878727329077 0.07480712166510155 210.7708041418738)',
          hex: '#27727f',
          rgb: 'rgb(39, 114, 127)',
          hsl: 'hsl(188.64, 53.25%, 32.53%)',
        },
        {
          token: 'deep-current-300',
          oklch:
            'oklch(0.5565800415626535 0.08018686878257403 210.8876347355991)',
          hex: '#2e808e',
          rgb: 'rgb(46, 128, 142)',
          hsl: 'hsl(188.75, 51.06%, 36.86%)',
          name: 'NSW Teal 02',
        },
        {
          token: 'deep-current-350',
          oklch:
            'oklch(0.5602865643708496 0.11011622507911506 220.8613747262485)',
          hex: '#0082a2',
          rgb: 'rgb(0, 130, 162)',
          hsl: 'hsl(189.91, 100%, 26.21%)',
        },
        {
          token: 'deep-current-400',
          oklch:
            'oklch(0.5639930871790456 0.1400455813756561 230.83511471689792)',
          hex: '#0082b8',
          rgb: 'rgb(0, 130, 184)',
          hsl: 'hsl(193.65, 100%, 25.57%)',
        },
        {
          token: 'deep-current-450',
          oklch:
            'oklch(0.5676996099872416 0.16997493767219712 240.8088547075473)',
          hex: '#007ed0',
          rgb: 'rgb(0, 126, 208)',
          hsl: 'hsl(198.32, 100%, 29.23%)',
        },
        {
          token: 'deep-current-500',
          oklch:
            'oklch(0.5714061327954376 0.19990429396873818 250.7825946981967)',
          hex: '#0077e7',
          rgb: 'rgb(0, 119, 231)',
          hsl: 'hsl(204.09, 100%, 35.98%)',
        },
        {
          token: 'deep-current-550',
          oklch:
            'oklch(0.5751126556036337 0.22983365026527922 260.7563346888461)',
          hex: '#146cfd',
          rgb: 'rgb(20, 108, 253)',
          hsl: 'hsl(217.34, 98.31%, 53.53%)',
          name: 'NSW Blue 02',
        },
        {
          token: 'deep-current-600',
          oklch:
            'oklch(0.6329084041312646 0.20229545991836423 253.324100552745)',
          hex: '#0089ff',
          rgb: 'rgb(0, 137, 255)',
          hsl: 'hsl(206.24, 100%, 47%)',
        },
        {
          token: 'deep-current-650',
          oklch:
            'oklch(0.6907041526588955 0.17475726957144927 245.8918664166439)',
          hex: '#0ca2ff',
          rgb: 'rgb(12, 162, 255)',
          hsl: 'hsl(203.05, 100%, 52.55%)',
        },
        {
          token: 'deep-current-700',
          oklch:
            'oklch(0.7484999011865263 0.1472190792245343 238.45963228054276)',
          hex: '#3bb9ff',
          rgb: 'rgb(59, 185, 255)',
          hsl: 'hsl(201.53, 100%, 61.68%)',
        },
        {
          token: 'deep-current-750',
          oklch:
            'oklch(0.8062956497141572 0.11968088887761932 231.02739814444166)',
          hex: '#64cdff',
          rgb: 'rgb(100, 205, 255)',
          hsl: 'hsl(199.08, 99.69%, 69.52%)',
        },
        {
          token: 'deep-current-800',
          oklch:
            'oklch(0.8640913982417882 0.09214269853070436 223.59516400834056)',
          hex: '#8ce0ff',
          rgb: 'rgb(140, 224, 255)',
          hsl: 'hsl(196.17, 100%, 77.45%)',
          name: 'NSW Blue 03',
        },
        {
          token: 'deep-current-850',
          oklch:
            'oklch(0.876607835646608 0.08204682871763162 224.45428856710376)',
          hex: '#9ae3ff',
          rgb: 'rgb(154, 227, 255)',
          hsl: 'hsl(196.84, 99.95%, 80.17%)',
        },
        {
          token: 'deep-current-900',
          oklch:
            'oklch(0.8891242730514279 0.07195095890455891 225.31341312586693)',
          hex: '#a7e5ff',
          rgb: 'rgb(167, 229, 255)',
          hsl: 'hsl(197.46, 99.46%, 82.69%)',
        },
        {
          token: 'deep-current-950',
          oklch:
            'oklch(0.9016407104562478 0.06185508909148618 226.17253768463013)',
          hex: '#b3e8fe',
          rgb: 'rgb(179, 232, 254)',
          hsl: 'hsl(198.06, 98.33%, 85.06%)',
        },
        {
          token: 'deep-current-1000',
          oklch:
            'oklch(0.9141571478610677 0.05175921927841346 227.0316622433933)',
          hex: '#bfeafe',
          rgb: 'rgb(191, 234, 254)',
          hsl: 'hsl(198.64, 96.23%, 87.29%)',
        },
        {
          token: 'deep-current-1050',
          oklch:
            'oklch(0.9266735852658876 0.04166334946534074 227.8907868021565)',
          hex: '#cbedfd',
          rgb: 'rgb(203, 237, 253)',
          hsl: 'hsl(199.2, 92.59%, 89.41%)',
          name: 'NSW Blue 04',
        },
      ],
    },
  },
  diverging: {
    'blue-red': {
      name: 'Blue Red',
      colors: [
        {
          token: 'blue-red-50',
          oklch:
            'oklch(0.28999868761296915 0.11729575493611505 259.8419383518128)',
          hex: '#002664',
          rgb: 'rgb(0, 38, 100)',
          hsl: 'hsl(217.2, 100%, 19.61%)',
          name: 'NSW Blue 01',
        },
        {
          token: 'blue-red-100',
          oklch:
            'oklch(0.34702148121110205 0.1398033340019479 260.02481761921945)',
          hex: '#013380',
          rgb: 'rgb(1, 51, 128)',
          hsl: 'hsl(216.47, 98.23%, 25.41%)',
        },
        {
          token: 'blue-red-150',
          oklch:
            'oklch(0.404044274809235 0.16231091306778073 260.20769688662614)',
          hex: '#03419e',
          rgb: 'rgb(3, 65, 158)',
          hsl: 'hsl(216.25, 95.7%, 31.67%)',
        },
        {
          token: 'blue-red-200',
          oklch:
            'oklch(0.4610670684073679 0.18481849213361357 260.3905761540328)',
          hex: '#074fbd',
          rgb: 'rgb(7, 79, 189)',
          hsl: 'hsl(216.42, 92.38%, 38.48%)',
        },
        {
          token: 'blue-red-250',
          oklch:
            'oklch(0.5180898620055008 0.2073260711994464 260.57345542143946)',
          hex: '#0d5ddc',
          rgb: 'rgb(13, 93, 220)',
          hsl: 'hsl(216.89, 88.51%, 45.86%)',
        },
        {
          token: 'blue-red-300',
          oklch:
            'oklch(0.5751126556036337 0.22983365026527922 260.7563346888461)',
          hex: '#146cfd',
          rgb: 'rgb(20, 108, 253)',
          hsl: 'hsl(217.34, 98.31%, 53.53%)',
          name: 'NSW Blue 02',
        },
        {
          token: 'blue-red-350',
          oklch:
            'oklch(0.6600901244829069 0.18386692021222337 260.7563346888461)',
          hex: '#4c8eff',
          rgb: 'rgb(76, 142, 255)',
          hsl: 'hsl(218.23, 100%, 65.24%)',
        },
        {
          token: 'blue-red-400',
          oklch:
            'oklch(0.7450675933621802 0.13790019015916752 260.7563346888461)',
          hex: '#79acff',
          rgb: 'rgb(121, 172, 255)',
          hsl: 'hsl(217.96, 100%, 74.56%)',
        },
        {
          token: 'blue-red-450',
          oklch:
            'oklch(0.8300450622414535 0.0919334601061117 260.7563346888461)',
          hex: '#a5c8ff',
          rgb: 'rgb(165, 200, 255)',
          hsl: 'hsl(217.7, 100%, 83.35%)',
        },
        {
          token: 'blue-red-500',
          oklch:
            'oklch(0.9150225311207267 0.04596673005305582 260.7563346888461)',
          hex: '#d2e4ff',
          rgb: 'rgb(210, 228, 255)',
          hsl: 'hsl(217.55, 100%, 91.82%)',
        },
        {
          token: 'blue-red-550',
          oklch:
            'oklch(0.9123910842879082 0.043501002286023355 20.33355954538788)',
          hex: '#fed7d6',
          rgb: 'rgb(254, 215, 214)',
          hsl: 'hsl(2.01, 95.63%, 91.77%)',
        },
        {
          token: 'blue-red-600',
          oklch:
            'oklch(0.8247821685758164 0.08700200457204671 20.33355954538788)',
          hex: '#f9afae',
          rgb: 'rgb(249, 175, 174)',
          hsl: 'hsl(1.13, 86.74%, 82.98%)',
        },
        {
          token: 'blue-red-650',
          oklch:
            'oklch(0.7371732528637247 0.13050300685807004 20.33355954538788)',
          hex: '#f18687',
          rgb: 'rgb(241, 134, 135)',
          hsl: 'hsl(359.64, 79.13%, 73.58%)',
        },
        {
          token: 'blue-red-700',
          oklch:
            'oklch(0.6495643371516329 0.17400400914409342 20.33355954538788)',
          hex: '#e55961',
          rgb: 'rgb(229, 89, 97)',
          hsl: 'hsl(356.91, 73.26%, 62.53%)',
        },
        {
          token: 'blue-red-750',
          oklch:
            'oklch(0.561955421439541 0.21750501143011675 20.33355954538788)',
          hex: '#d7153a',
          rgb: 'rgb(215, 21, 58)',
          hsl: 'hsl(348.56, 82.2%, 46.27%)',
          name: 'NSW Red 02',
        },
        {
          token: 'blue-red-800',
          oklch:
            'oklch(0.5129578165530939 0.1993814048599521 19.6934710817863)',
          hex: '#bf0f34',
          rgb: 'rgb(191, 15, 52)',
          hsl: 'hsl(347.53, 85.06%, 40.38%)',
        },
        {
          token: 'blue-red-850',
          oklch:
            'oklch(0.4639602116666469 0.18125779828978744 19.053382618184717)',
          hex: '#a70a2d',
          rgb: 'rgb(167, 10, 45)',
          hsl: 'hsl(346.42, 88.86%, 34.61%)',
        },
        {
          token: 'blue-red-900',
          oklch:
            'oklch(0.4149626067801998 0.1631341917196228 18.413294154583134)',
          hex: '#8f0527',
          rgb: 'rgb(143, 5, 39)',
          hsl: 'hsl(345.46, 93.03%, 29.13%)',
        },
        {
          token: 'blue-red-950',
          oklch:
            'oklch(0.36596500189375275 0.14501058514945814 17.773205690981552)',
          hex: '#790220',
          rgb: 'rgb(121, 2, 32)',
          hsl: 'hsl(344.9, 96.76%, 24.08%)',
        },
        {
          token: 'blue-red-1000',
          oklch:
            'oklch(0.3169673970073057 0.12688697857929349 17.13311722737997)',
          hex: '#630019',
          rgb: 'rgb(99, 0, 25)',
          hsl: 'hsl(344.85, 100%, 19.41%)',
          name: 'NSW Red 01',
        },
      ],
    },
    'blue-orange': {
      name: 'Blue Orange',
      colors: [
        {
          token: 'blue-orange-50',
          oklch:
            'oklch(0.28999868761296915 0.11729575493611505 259.8419383518128)',
          hex: '#002664',
          rgb: 'rgb(0, 38, 100)',
          hsl: 'hsl(217.2, 100%, 19.61%)',
          name: 'NSW Blue 01',
        },
        {
          token: 'blue-orange-100',
          oklch:
            'oklch(0.34702148121110205 0.1398033340019479 260.02481761921945)',
          hex: '#013380',
          rgb: 'rgb(1, 51, 128)',
          hsl: 'hsl(216.47, 98.23%, 25.41%)',
        },
        {
          token: 'blue-orange-150',
          oklch:
            'oklch(0.404044274809235 0.16231091306778073 260.20769688662614)',
          hex: '#03419e',
          rgb: 'rgb(3, 65, 158)',
          hsl: 'hsl(216.25, 95.7%, 31.67%)',
        },
        {
          token: 'blue-orange-200',
          oklch:
            'oklch(0.4610670684073679 0.18481849213361357 260.3905761540328)',
          hex: '#074fbd',
          rgb: 'rgb(7, 79, 189)',
          hsl: 'hsl(216.42, 92.38%, 38.48%)',
        },
        {
          token: 'blue-orange-250',
          oklch:
            'oklch(0.5180898620055008 0.2073260711994464 260.57345542143946)',
          hex: '#0d5ddc',
          rgb: 'rgb(13, 93, 220)',
          hsl: 'hsl(216.89, 88.51%, 45.86%)',
        },
        {
          token: 'blue-orange-300',
          oklch:
            'oklch(0.5751126556036337 0.22983365026527922 260.7563346888461)',
          hex: '#146cfd',
          rgb: 'rgb(20, 108, 253)',
          hsl: 'hsl(217.34, 98.31%, 53.53%)',
          name: 'NSW Blue 02',
        },
        {
          token: 'blue-orange-350',
          oklch:
            'oklch(0.6600901244829069 0.18386692021222337 260.7563346888461)',
          hex: '#4c8eff',
          rgb: 'rgb(76, 142, 255)',
          hsl: 'hsl(218.23, 100%, 65.24%)',
        },
        {
          token: 'blue-orange-400',
          oklch:
            'oklch(0.7450675933621802 0.13790019015916752 260.7563346888461)',
          hex: '#79acff',
          rgb: 'rgb(121, 172, 255)',
          hsl: 'hsl(217.96, 100%, 74.56%)',
        },
        {
          token: 'blue-orange-450',
          oklch:
            'oklch(0.8300450622414535 0.0919334601061117 260.7563346888461)',
          hex: '#a5c8ff',
          rgb: 'rgb(165, 200, 255)',
          hsl: 'hsl(217.7, 100%, 83.35%)',
        },
        {
          token: 'blue-orange-500',
          oklch:
            'oklch(0.9150225311207267 0.04596673005305582 260.7563346888461)',
          hex: '#d2e4ff',
          rgb: 'rgb(210, 228, 255)',
          hsl: 'hsl(217.55, 100%, 91.82%)',
        },
        {
          token: 'blue-orange-550',
          oklch:
            'oklch(0.9348827724922799 0.0384858487491153 42.148082541241614)',
          hex: '#ffe2d6',
          rgb: 'rgb(255, 226, 214)',
          hsl: 'hsl(16.63, 100%, 92.35%)',
        },
        {
          token: 'blue-orange-600',
          oklch:
            'oklch(0.8697655449845598 0.0769716974982306 42.148082541241614)',
          hex: '#ffc4ad',
          rgb: 'rgb(255, 196, 173)',
          hsl: 'hsl(16.75, 100%, 84.24%)',
        },
        {
          token: 'blue-orange-650',
          oklch:
            'oklch(0.8046483174768397 0.11545754624734589 42.148082541241614)',
          hex: '#fea683',
          rgb: 'rgb(254, 166, 131)',
          hsl: 'hsl(16.91, 98.91%, 75.59%)',
        },
        {
          token: 'blue-orange-700',
          oklch:
            'oklch(0.7395310899691195 0.1539433949964612 42.148082541241614)',
          hex: '#fa8657',
          rgb: 'rgb(250, 134, 87)',
          hsl: 'hsl(17.33, 93.8%, 66.03%)',
        },
        {
          token: 'blue-orange-750',
          oklch:
            'oklch(0.6744138624613994 0.1924292437455765 42.148082541241614)',
          hex: '#f3631b',
          rgb: 'rgb(243, 99, 27)',
          hsl: 'hsl(20, 90%, 52.94%)',
          name: 'NSW Orange 02',
        },
        {
          token: 'blue-orange-800',
          oklch:
            'oklch(0.6259709205530395 0.18581910494387777 40.322953942880844)',
          hex: '#e05516',
          rgb: 'rgb(224, 85, 22)',
          hsl: 'hsl(18.62, 82.01%, 48.19%)',
        },
        {
          token: 'blue-orange-850',
          oklch:
            'oklch(0.5775279786446794 0.17920896614217904 38.49782534452007)',
          hex: '#cc4611',
          rgb: 'rgb(204, 70, 17)',
          hsl: 'hsl(17.17, 84.85%, 43.38%)',
        },
        {
          token: 'blue-orange-900',
          oklch:
            'oklch(0.5290850367363195 0.17259882734048035 36.672696746159296)',
          hex: '#b9380b',
          rgb: 'rgb(185, 56, 11)',
          hsl: 'hsl(15.67, 89.02%, 38.48%)',
        },
        {
          token: 'blue-orange-950',
          oklch:
            'oklch(0.4806420948279594 0.16598868853878163 34.847568147798526)',
          hex: '#a72a05',
          rgb: 'rgb(167, 42, 5)',
          hsl: 'hsl(13.86, 94.5%, 33.59%)',
        },
        {
          token: 'blue-orange-1000',
          oklch:
            'oklch(0.4321991529195994 0.1593785497370829 33.022439549437756)',
          hex: '#941b00',
          rgb: 'rgb(148, 27, 0)',
          hsl: 'hsl(10.95, 100%, 29.02%)',
          name: 'NSW Orange 01',
        },
      ],
    },
    'purple-yellow': {
      name: 'Purple Yellow',
      colors: [
        {
          token: 'purple-yellow-50',
          oklch:
            'oklch(0.3227578434964078 0.1489130726931451 302.732273036598)',
          hex: '#441170',
          rgb: 'rgb(68, 17, 112)',
          hsl: 'hsl(272.21, 73.64%, 25.29%)',
          name: 'NSW Purple 01',
        },
        {
          token: 'purple-yellow-100',
          oklch:
            'oklch(0.37455225184473395 0.16345336471971228 300.286155081269)',
          hex: '#511e88',
          rgb: 'rgb(81, 30, 136)',
          hsl: 'hsl(268.82, 63.8%, 32.55%)',
        },
        {
          token: 'purple-yellow-150',
          oklch:
            'oklch(0.42634666019306017 0.17799365674627945 297.84003712594)',
          hex: '#5d2ba1',
          rgb: 'rgb(93, 43, 161)',
          hsl: 'hsl(265.66, 57.74%, 40%)',
        },
        {
          token: 'purple-yellow-200',
          oklch:
            'oklch(0.4781410685413863 0.1925339487728466 295.39391917061107)',
          hex: '#6a39bb',
          rgb: 'rgb(106, 57, 187)',
          hsl: 'hsl(262.59, 53.52%, 47.71%)',
        },
        {
          token: 'purple-yellow-250',
          oklch:
            'oklch(0.5299354768897125 0.20707424079941378 292.9478012152821)',
          hex: '#7546d6',
          rgb: 'rgb(117, 70, 214)',
          hsl: 'hsl(259.57, 63.29%, 55.69%)',
        },
        {
          token: 'purple-yellow-300',
          oklch:
            'oklch(0.5817298852380387 0.22161453282598095 290.5016832599531)',
          hex: '#8055f1',
          rgb: 'rgb(128, 85, 241)',
          hsl: 'hsl(256.54, 84.78%, 63.92%)',
          name: 'NSW Purple 02',
        },
        {
          token: 'purple-yellow-350',
          oklch:
            'oklch(0.6653839081904309 0.17729162626078476 290.5016832599531)',
          hex: '#967bf7',
          rgb: 'rgb(150, 123, 247)',
          hsl: 'hsl(252.7, 88.36%, 72.62%)',
        },
        {
          token: 'purple-yellow-400',
          oklch:
            'oklch(0.7490379311428232 0.13296871969558857 290.5016832599531)',
          hex: '#ae9efb',
          rgb: 'rgb(174, 158, 251)',
          hsl: 'hsl(250.05, 92.77%, 80.24%)',
        },
        {
          token: 'purple-yellow-450',
          oklch:
            'oklch(0.8326919540952155 0.08864581313039238 290.5016832599531)',
          hex: '#c7bffe',
          rgb: 'rgb(199, 191, 254)',
          hsl: 'hsl(248.07, 97.91%, 87.26%)',
        },
        {
          token: 'purple-yellow-500',
          oklch:
            'oklch(0.9163459770476078 0.04432290656519619 290.5016832599531)',
          hex: '#e3dfff',
          rgb: 'rgb(227, 223, 255)',
          hsl: 'hsl(246.54, 100%, 93.83%)',
        },
        {
          token: 'purple-yellow-550',
          oklch:
            'oklch(0.9610075261881024 0.03347156626241622 77.59060081341511)',
          hex: '#fff0da',
          rgb: 'rgb(255, 240, 218)',
          hsl: 'hsl(35.67, 100%, 92.7%)',
        },
        {
          token: 'purple-yellow-600',
          oklch:
            'oklch(0.9220150523762047 0.06694313252483244 77.59060081341511)',
          hex: '#ffe0b4',
          rgb: 'rgb(255, 224, 180)',
          hsl: 'hsl(35.88, 98.83%, 85.12%)',
        },
        {
          token: 'purple-yellow-650',
          oklch:
            'oklch(0.8830225785643072 0.10041469878724865 77.59060081341511)',
          hex: '#fed08b',
          rgb: 'rgb(254, 208, 139)',
          hsl: 'hsl(36.33, 97.53%, 77.04%)',
        },
        {
          token: 'purple-yellow-700',
          oklch:
            'oklch(0.8440301047524096 0.1338862650496649 77.59060081341511)',
          hex: '#fcc05d',
          rgb: 'rgb(252, 192, 93)',
          hsl: 'hsl(37.31, 96.4%, 67.74%)',
        },
        {
          token: 'purple-yellow-750',
          oklch:
            'oklch(0.805037630940512 0.1673578313120811 77.59060081341511)',
          hex: '#faaf05',
          rgb: 'rgb(250, 175, 5)',
          hsl: 'hsl(41.63, 96.08%, 50%)',
          name: 'NSW Yellow 02',
        },
        {
          token: 'purple-yellow-800',
          oklch:
            'oklch(0.7294953114162297 0.1516602301648859 77.80824509240053)',
          hex: '#db9903',
          rgb: 'rgb(219, 153, 3)',
          hsl: 'hsl(41.7, 97.32%, 43.56%)',
        },
        {
          token: 'purple-yellow-850',
          oklch:
            'oklch(0.6539529918919474 0.13596262901769068 78.02588937138594)',
          hex: '#bd8402',
          rgb: 'rgb(189, 132, 2)',
          hsl: 'hsl(41.71, 98.31%, 37.41%)',
        },
        {
          token: 'purple-yellow-900',
          oklch:
            'oklch(0.5784106723676652 0.1202650278704955 78.24353365037135)',
          hex: '#a06f01',
          rgb: 'rgb(160, 111, 1)',
          hsl: 'hsl(41.64, 99.07%, 31.54%)',
        },
        {
          token: 'purple-yellow-950',
          oklch:
            'oklch(0.5028683528433828 0.10456742672330029 78.46117792935677)',
          hex: '#845b00',
          rgb: 'rgb(132, 91, 0)',
          hsl: 'hsl(41.47, 99.62%, 25.93%)',
        },
        {
          token: 'purple-yellow-1000',
          oklch:
            'oklch(0.42732603331910063 0.0888698255761051 78.67882220834218)',
          hex: '#694800',
          rgb: 'rgb(105, 72, 0)',
          hsl: 'hsl(41.14, 100%, 20.59%)',
          name: 'NSW Yellow 01',
        },
      ],
    },
    'fuchsia-teal': {
      name: 'Fuchsia Teal',
      colors: [
        {
          token: 'fuchsia-teal-50',
          oklch:
            'oklch(0.340575889122065 0.14685114320973375 341.7061446429382)',
          hex: '#65004d',
          rgb: 'rgb(101, 0, 77)',
          hsl: 'hsl(314.26, 100%, 19.8%)',
          name: 'NSW Fuchsia 01',
        },
        {
          token: 'fuchsia-teal-100',
          oklch:
            'oklch(0.39271137664696126 0.16832751251930148 341.41537719439964)',
          hex: '#7b025f',
          rgb: 'rgb(123, 2, 95)',
          hsl: 'hsl(313.81, 97.5%, 24.42%)',
        },
        {
          token: 'fuchsia-teal-150',
          oklch:
            'oklch(0.4448468641718576 0.1898038818288692 341.12460974586105)',
          hex: '#920472',
          rgb: 'rgb(146, 4, 114)',
          hsl: 'hsl(313.5, 94.54%, 29.35%)',
        },
        {
          token: 'fuchsia-teal-200',
          oklch:
            'oklch(0.49698235169675387 0.2112802511384369 340.8338422973224)',
          hex: '#a90885',
          rgb: 'rgb(169, 8, 133)',
          hsl: 'hsl(313.28, 91.15%, 34.65%)',
        },
        {
          token: 'fuchsia-teal-250',
          oklch:
            'oklch(0.5491178392216501 0.23275662044800466 340.5430748487838)',
          hex: '#c10d99',
          rgb: 'rgb(193, 13, 153)',
          hsl: 'hsl(313.13, 87.55%, 40.29%)',
        },
        {
          token: 'fuchsia-teal-300',
          oklch:
            'oklch(0.6012533267465464 0.25423298975757236 340.25230740024523)',
          hex: '#d912ae',
          rgb: 'rgb(217, 18, 174)',
          hsl: 'hsl(312.96, 84.68%, 46.08%)',
          name: 'NSW Fuchsia 02',
        },
        {
          token: 'fuchsia-teal-350',
          oklch:
            'oklch(0.6810026613972371 0.2033863918060579 340.25230740024523)',
          hex: '#e65bbf',
          rgb: 'rgb(230, 91, 191)',
          hsl: 'hsl(316.92, 73.48%, 62.9%)',
        },
        {
          token: 'fuchsia-teal-400',
          oklch:
            'oklch(0.7607519960479279 0.15253979385454342 340.25230740024523)',
          hex: '#f088cf',
          rgb: 'rgb(240, 136, 207)',
          hsl: 'hsl(319.1, 78.1%, 73.8%)',
        },
        {
          token: 'fuchsia-teal-450',
          oklch:
            'oklch(0.8405013306986185 0.10169319590302894 340.25230740024523)',
          hex: '#f8b1df',
          rgb: 'rgb(248, 177, 223)',
          hsl: 'hsl(320.89, 83.99%, 83.32%)',
        },
        {
          token: 'fuchsia-teal-500',
          oklch:
            'oklch(0.9202506653493093 0.05084659795151447 340.25230740024523)',
          hex: '#fdd8ef',
          rgb: 'rgb(253, 216, 239)',
          hsl: 'hsl(322.5, 91.05%, 92.01%)',
        },
        {
          token: 'fuchsia-teal-550',
          oklch:
            'oklch(0.9113160083125307 0.016037373756514806 210.8876347355991)',
          hex: '#d6e5e8',
          rgb: 'rgb(214, 229, 232)',
          hsl: 'hsl(189.91, 27.19%, 87.45%)',
        },
        {
          token: 'fuchsia-teal-600',
          oklch:
            'oklch(0.8226320166250614 0.03207474751302961 210.8876347355991)',
          hex: '#aecbd1',
          rgb: 'rgb(174, 203, 209)',
          hsl: 'hsl(189.88, 27.24%, 75.07%)',
        },
        {
          token: 'fuchsia-teal-650',
          oklch:
            'oklch(0.733948024937592 0.048112121269544415 210.8876347355991)',
          hex: '#86b2ba',
          rgb: 'rgb(134, 178, 186)',
          hsl: 'hsl(189.78, 27.44%, 62.78%)',
        },
        {
          token: 'fuchsia-teal-700',
          oklch:
            'oklch(0.6452640332501227 0.06414949502605923 210.8876347355991)',
          hex: '#5d99a4',
          rgb: 'rgb(93, 153, 164)',
          hsl: 'hsl(189.53, 28%, 50.37%)',
        },
        {
          token: 'fuchsia-teal-750',
          oklch:
            'oklch(0.5565800415626535 0.08018686878257403 210.8876347355991)',
          hex: '#2e808e',
          rgb: 'rgb(46, 128, 142)',
          hsl: 'hsl(188.75, 51.06%, 36.86%)',
          name: 'NSW Teal 02',
        },
        {
          token: 'fuchsia-teal-800',
          oklch:
            'oklch(0.5130878727329077 0.07480712166510155 210.7708041418738)',
          hex: '#27727f',
          rgb: 'rgb(39, 114, 127)',
          hsl: 'hsl(188.64, 53.25%, 32.53%)',
        },
        {
          token: 'fuchsia-teal-850',
          oklch:
            'oklch(0.46959570390316185 0.06942737454762905 210.6539735481485)',
          hex: '#206571',
          rgb: 'rgb(32, 101, 113)',
          hsl: 'hsl(188.52, 56.06%, 28.28%)',
        },
        {
          token: 'fuchsia-teal-900',
          oklch:
            'oklch(0.42610353507341603 0.06404762743015657 210.53714295442322)',
          hex: '#195862',
          rgb: 'rgb(25, 88, 98)',
          hsl: 'hsl(188.38, 59.83%, 24.13%)',
        },
        {
          token: 'fuchsia-teal-950',
          oklch:
            'oklch(0.3826113662436702 0.05866788031268409 210.42031236069792)',
          hex: '#124b54',
          rgb: 'rgb(18, 75, 84)',
          hsl: 'hsl(188.21, 65.12%, 20.06%)',
        },
        {
          token: 'fuchsia-teal-1000',
          oklch:
            'oklch(0.33911919741392443 0.053288133195211605 210.30348176697262)',
          hex: '#0b3f47',
          rgb: 'rgb(11, 63, 71)',
          hsl: 'hsl(188, 73.17%, 16.08%)',
          name: 'NSW Teal 01',
        },
      ],
    },
  },
}

export const colorThemes = generateColorThemes(colors)
