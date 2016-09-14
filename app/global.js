// App Config
icerinkApp.constant('Config', {
    'APP_NAME' : 'IMPERO SNOW THROW',
    'APP_VERSION' : '1.0.0',
    'GOOGLE_ANALYTICS_ID' : '',
    'BASE_URL' : '',
    'SYSTEM_LANGUAGE' : '',
}); 

// Firebase Config
icerinkApp.constant('DbConfig', {
    'FIREBASE_URL' : 'https://shining-fire-3444.firebaseio.com/people',
    'GROUPS' : [
      { id: 0, title: 'Impero' },
      { id: 1, title: 'Pernod Ricard Winemakers Team 1' },
      { id: 2, title: 'Pernod Ricard Winemakers Team 2' },
      { id: 3, title: 'Domeq Bodegas San Sebastian' },
      { id: 4, title: 'Pernod Ricard Travel Retail EU' },
      { id: 5, title: 'Beefeater' },
      { id: 6, title: 'Lindt UK' },
  ]
});

// Game Config
icerinkApp.constant('GameConfig', {
    // General
    snowballAudioHitWindow : 'theme/icerink/fx/snowballHitWindow.mp3',
    // Skaters
    charImg: 'theme/icerink/img/char/[NAME].png', // String | Skater Image Path
    charImgBig : 'theme/icerink/img/charBig/[NAME]b.jpg', // String | Skater Big Thumbnail 
    maxPlayer: 20, // int | Max Skater In Scene
    minPlayer: 1, // int |Min Skater In Scene
    hideWhenHit: 400, // int | milisecond
    respawnAfterHit: 6000, // int | milisecond
    skaterAudioSlip: 'theme/icerink/fx/slideDown.mp3',
    maxSpeed: 9, // int !! Higher number slow down skater. Small number speed up skater.
    minSpeed: 7, // int !! Skaters speed randomly changing between maxSpeed/minSpeed on every lap.
    // Score
    hitPoint: 10, // int | Hit
    getHitPoint: -5, // int | Get Hit
    // Snow Ball
    snowballStartPoint: [552, 200], // Array | Based SVG Area X-Y
    snowballCurve: 100, // int | pixel to top
    snowballSpeed: 500, // int | milisecond
    snowballFadeout: 100, // int | milisecond
    snowballAudioHit: 'theme/icerink/fx/snowballHit.mp3', // Hit Sound
    // Snow Effect
    snowEffect: false, // bool
    snowFlakeRound: true, // bool
    snowFlakeMinSize: 2, // int | pixel
    snowFlakeMaxSize: 3, // int | pixel
    snowFlakeMaxSpeed: 3, // int
    snowFlakeMCount: 100, // int
    // Parallax Effect
    parallaxEffect: true,
    mountainSpeedBack : 0.02,
    mountainSpeedFront : 0.01,
    // Fake Login
    fakeLoginOn: false,
    fakeLoginName: 'Pedro Usuriaga',
});

icerinkApp.value('AppOwner', {
    name: 'Sener Koc',
    company: 'lifetoweb',
    mail: 'sener@lifetoweb.com'
});
