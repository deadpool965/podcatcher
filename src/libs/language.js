import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
  en: {
    header: 'Header',
    options: 'Options',
    download: 'Download',
    downloaded: 'Downloaded',
    downloads: 'Downloads',
    cancelDownload: '({0}%) Cancel Download',
    deleteDownload: 'Delete Download',
    readMore: 'Read More',
    createdBy: 'Created by',
    thisIsAnXProject: 'This is an {0} project',
    openSource: 'Open Source',
    close: 'Close',
    discover: 'Discover',
    subscriptions: 'Subscriptions',
    return: 'Return',
    subscribe: 'Subscribe',
    unsubscribe: 'Unsubscribe',
    youAreOffline: 'You are offline',
    networkCouldNotBeReached: 'The network could not be reached',
    appearsOffline: 'It appears that you are offline',
    playTitle: 'Play {0}',
    playerNavigation: 'Player Navigation',
    setTimer: 'Set Timer',
    timerOff: 'Off',
    xMinutes: '{0} minutes',
    setPlaybackRate: 'Set Playback Rate',
    error: 'Error',
    errorAudioStream: 'Something went wrong with the audio stream. Check your Internet connection and try again.',
    collapsePlayer: 'Collapse Player',
    expandPlayer: 'Expand Player',
    progressBar: 'Progress Bar',
    rewind15Seconds: 'Rewind 15 seconds',
    Fastforward15Seconds: 'Fastforward 15 seconds',
    loading: 'Loading',
    updateAvailable: 'Update Available',
    refresh: 'Refresh',
    noResultsFound: 'No results found.',
    metaDescription: 'PodCatcher is a free podcast player for the web. Listen to podcasts on or phone or desktop',
    searchPodcasts: 'Search Podcasts',
    searchByName: 'Search by name',
    search: 'Search',
    resultsForX: 'Results for "{0}"',
    clear: 'Clear',
    popularPodcastsInX: 'Popular Podcasts in {0}',
    podcastMetaDescription: 'Listen to {0} episodes of {1} on PodCatcher',
    showXResults: 'Show {0} results',
    selectLimit: 'Select Limit',
    logoOfX: 'Logo of {0}',
    loadingImage: 'Loading image...',
    searchForEpisodes: 'Search For Episodes',
    searchEpisode: 'Search episode',
    changeLimit: 'Change Limit',
    changeOrder: 'Change Order',
    podcastEpisodes: 'Podcast Episodes',
    showMoreEpisodes: 'Show More Episodes',
    pause: 'Pause',
    selectLanguage: 'Select Language',
  },
  pt: {
    header: 'Cabeçalho',
    options: 'Opções',
    download: 'Baixar',
    downloaded: 'Baixado',
    downloads: 'Baixados',
    cancelDownload: '({0}%) Cancelar Download',
    deleteDownload: 'Apagar Download',
    readMore: 'Leia Mais',
    createdBy: 'Criado Por',
    thisIsAnXProject: 'Este projeto é de {0}',
    openSource: 'Código Aberto',
    close: 'Fechar',
    discover: 'Descobrir',
    subscriptions: 'Inscrições',
    return: 'Voltar',
    subscribe: 'Inscrever',
    unsubscribe: 'Desinscrever',
    youAreOffline: 'Você está offline',
    networkCouldNotBeReached: 'Não conseguimos comunicar com a rede',
    appearsOffline: 'Parece que está sem Internet',
    playTitle: 'Tocar {0}',
    playerNavigation: 'Navegação do Player',
    setTimer: 'Cronômetro',
    timerOff: 'Desligar',
    xMinutes: '{0} minutos',
    setPlaybackRate: 'Velocidade de Reprodução',
    error: 'Erro',
    errorAudioStream: 'Há algo errado com a reprodução do áudio. Verifique sua conexão com a Internet e tente novamente.',
    collapsePlayer: 'Minimizar Player',
    expandPlayer: 'Expandir Player',
    progressBar: 'Barra de Progresso',
    rewind15Seconds: 'Voltar 15 segundos',
    Fastforward15Seconds: 'Avançar 15 segundos',
    loading: 'Carregando',
    updateAvailable: 'Nova versão',
    refresh: 'Atualizar',
    noResultsFound: 'Nenhum resultado encontrado.',
    metaDescription: 'PodCatcher é um player gratuito de podcasts para a web. Ouça podcasts no seu telefone ou computador.',
    searchPodcasts: 'Pesquisar por Podcasts',
    searchByName: 'Pesquisar por nome',
    search: 'Pesquisar',
    resultsForX: 'Resultados para "{0}"',
    clear: 'Limpar',
    popularPodcastsInX: 'Podcasts Populares ({0})',
    podcastMetaDescription: 'Ouça {0} episódios de {1} no PodCatcher',
    showXResults: 'Mostrar {0} resultados',
    selectLimit: 'Selecionar Limite',
    logoOfX: 'Logo de {0}',
    loadingImage: 'Carregando imagem...',
    searchForEpisodes: 'Buscar por episódios',
    searchEpisode: 'Buscar episódio',
    changeLimit: 'Mudar Limite',
    changeOrder: 'Mudar Ordem',
    podcastEpisodes: 'Episódios do Podcast',
    showMoreEpisodes: 'Mostrar Mais Episódios',
    pause: 'Pausar',
    selectLanguage: 'Selecionar Idioma',
  },
});

export const AVAILABLE_LANGUAGES = [
  { id: 'en', value: 'English' },
  { id: 'pt', value: 'Português' },
];

const browserLanguage = /^[a-z]{2}-[A-Z]{2}$/.test(navigator.language)
  ? navigator.language.split('-')[0]
  : 'en';

const preferredLanguage = localStorage.lang || browserLanguage;

export const language = AVAILABLE_LANGUAGES
  .map(l => l.id)
  .indexOf(preferredLanguage) !== -1
  ? preferredLanguage
  : 'en';

strings.setLanguage(language);

export const changeLanguage = (lang) => {
  localStorage.setItem('lang', lang);
  strings.setLanguage(lang);
};

export default strings;
