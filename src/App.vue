<template>
  <div id="app" class="min-h-screen bg-mgt-bg">
    <!-- Main Window Container -->
    <div class="mgt-window">
      <!-- Window Header -->
      <div class="mgt-window-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="mgt-icon">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <h1 class="text-white text-lg font-semibold">{{ t('gameEditor') }}</h1>
          </div>
          
          <!-- Language Selector -->
          <div class="relative">
            <select v-model="locale" @change="onLanguageChange" class="mgt-language-select">
              <option 
                v-for="language in sortedLocales" 
                :key="language.locale"
                :value="language.locale"
              >
                {{ language.displayLocale }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Window Content -->
      <div class="mgt-window-content">
        <!-- Configuration Section -->
        <div class="mgt-section">
          <div class="mgt-section-header">
            <h2>{{ t('gameConfiguration') }}</h2>
          </div>
          
          <div class="mgt-section-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Main Genre -->
              <div class="mgt-field">
                <label class="mgt-label">{{ t('mainGenre') }}</label>
                <select v-model.number="genre" class="mgt-select">
                  <option value="-1">{{ t('selectGenre') }}</option>
                  <option 
                    v-for="gen of sortedGenres" 
                    :key="gen.ID" 
                    :value="gen.ID"
                  >
                    {{ gen[genreNameKey] || gen[genreFallbackKey] }}
                  </option>
                </select>
              </div>

              <!-- Subgenre -->
              <div class="mgt-field">
                <label class="mgt-label">{{ t('subgenre') }}</label>
                <select v-model.number="subGenre" :disabled="genre === -1" class="mgt-select">
                  <option value="-1">{{ t('nothing') }}</option>
                  <option 
                    v-for="gen of sortedSubGenres" 
                    :key="gen.ID" 
                    :value="gen.ID"
                  >
                    {{ gen[genreNameKey] || gen[genreFallbackKey] }}
                  </option>
                </select>
              </div>

              <!-- Main Topic -->
              <div class="mgt-field">
                <label class="mgt-label">{{ t('mainTopic') }}</label>
                <select v-model.number="topic" :disabled="genre === -1" class="mgt-select">
                  <option value="-1">{{ t('selectTopic') }}</option>
                  <option 
                    v-for="topicItem of sortedMainTopic" 
                    :key="topicItem.key" 
                    :value="topicItem.key"
                  >
                    {{ topicItem.value }}
                  </option>
                </select>
              </div>

              <!-- Subtopic -->
              <div class="mgt-field">
                <label class="mgt-label">{{ t('subtopic') }}</label>
                <select v-model.number="subTopic" :disabled="genre === -1" class="mgt-select">
                  <option value="-1">{{ t('nothing') }}</option>
                  <option 
                    v-for="topicItem of sortedMainTopic" 
                    :key="topicItem.key" 
                    :value="topicItem.key"
                  >
                    {{ topicItem.value }}
                  </option>
                </select>
              </div>
            </div>


          </div>
        </div>

        <!-- Results Section -->
        <div v-if="genre !== -1" class="space-y-3 mt-4">
          <!-- Target Groups -->
          <div class="mgt-section">
            <div class="mgt-section-header">
              <h3>{{ t('targetGroups') }}</h3>
            </div>
            <div class="mgt-section-content">
              <div class="flex flex-wrap gap-2">
                <div 
                  v-for="group in genres[genre].TGROUP" 
                  :key="group"
                  class="mgt-chip"
                >
                  {{ formatTargetGroup(group) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Design Settings -->
          <div v-if="focus" class="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <!-- Design Focus -->
            <div class="mgt-section">
              <div class="mgt-section-header-blue">
                <h3>{{ t('designFocus') }}</h3>
              </div>
              <div class="mgt-section-content">
                <div class="space-y-3">
                  <div v-for="(value, index) in focus" :key="index" class="mgt-value-row">
                    <span class="mgt-value-badge">{{ value }}</span>
                    <span class="mgt-label-text">{{ t(getFocusLabelKey(index)) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Design Direction -->
            <div class="mgt-section">
              <div class="mgt-section-header-blue">
                <h3>{{ t('designDirection') }}</h3>
              </div>
              <div class="mgt-section-content">
                <div class="space-y-4">
                  <div v-for="(value, index) in align" :key="index" class="mgt-slider-row">
                    <div class="mgt-slider-labels">
                      <span class="mgt-value-badge">{{ value }}</span>
                      <span class="mgt-label-text">{{ t(getAlignLabelLeftKey(index)) }}</span>
                      <span class="mgt-label-text text-right">{{ t(getAlignLabelRightKey(index)) }}</span>
                    </div>
                    <div class="mgt-slider">
                      <div class="mgt-slider-track"></div>
                      <div class="mgt-slider-handle" :style="{ left: (value * 10) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Design Priority -->
            <div class="mgt-section">
              <div class="mgt-section-header-blue">
                <h3>{{ t('designPriority') }}</h3>
              </div>
              <div class="mgt-section-content">
                <div class="space-y-3">
                  <div v-for="(value, index) in priority" :key="index" class="mgt-priority-row">
                    <div class="mgt-priority-icon">
                      <svg class="w-5 h-5" :class="getPriorityIconColor(index)" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="getPriorityIcon(index)"></path>
                      </svg>
                    </div>
                    <span class="mgt-label-text">{{ t(getPriorityLabelKey(index)) }}</span>
                    <div class="mgt-priority-label">
                      <span class="font-semibold">{{ value }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>

    <!-- Credits Footer -->
    <div class="mgt-credits">
      <div class="mgt-credits-content">
        <div class="mgt-credits-frontend">
          <span>Frontend redesigned with </span>
          <span class="mgt-credits-heart">❤️</span>
          <span> by Matshio7</span>
        </div>
        <div class="mgt-credits-row">
          <div class="mgt-credits-original">
            <span class="mgt-credits-label">Original Game:</span>
            <a href="https://store.steampowered.com/app/1342330/Mad_Games_Tycoon_2/" target="_blank" class="mgt-credits-link">
              Mad Games Tycoon 2 by Eggcode
            </a>
          </div>
          <div class="mgt-credits-dev">
            <span class="mgt-credits-label">Original Editor:</span>
            <a href="https://github.com/derpierre65/mgt-editor" target="_blank" class="mgt-credits-link">
              derpierre65 on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import genres from './data/genres.json';
import topics from './data/themes.json';
import combinations from './data/combinations.json';
import translations from './data/translations.json';

export default {
  name: 'App',
  data() {
    const locales = Object.keys(topics).map((locale) => {
      let realLocale = locale;
      let displayLocale = locale;
      
      // Map locale codes to country flags
      if (locale === 'GE') realLocale = 'DE';
      if (locale === 'EN') realLocale = 'US';
      if (locale === 'TU') realLocale = 'TR';
      if (locale === 'PB') realLocale = 'PT';
      if (locale === 'CT') realLocale = 'ZH';
      if (locale === 'CH') realLocale = 'ZH';
      
      // Map locale codes to better display names
      if (locale === 'GE') displayLocale = 'DE';
      if (locale === 'PB') displayLocale = 'PT';
      if (locale === 'TU') displayLocale = 'TR';

      return {
        locale,
        displayLocale,
        realLocale: realLocale.toLowerCase(),
      };
    });

    return {
      genres,
      topics,
      locales,
      combinations,
      translations,
      genreFallbackKey: 'NAME EN',
      locale: window.localStorage && window.localStorage.getItem('latest_locale') || 'EN',
      genre: -1,
      subGenre: -1,
      topic: -1,
      subTopic: -1,
      focus: null,
      align: {},
      priority: [],
      showLanguages: false,
    };
  },
  watch: {
    genre() {
      this.generateGame();
    },
    subGenre() {
      this.generateGame();
    },
  },
  computed: {
    genreNameKey() {
      return `NAME ${this.locale}`;
    },
    currentFlag() {
      const currentLang = this.locales.find(l => l.locale === this.locale);
      return currentLang ? currentLang.realLocale : 'us';
    },
    sortedGenres() {
      const genreArray = Object.values(genres);
      return genreArray.sort((a, b) => {
        const nameA = a[this.genreNameKey] || a[this.genreFallbackKey] || '';
        const nameB = b[this.genreNameKey] || b[this.genreFallbackKey] || '';
        return nameA.localeCompare(nameB);
      });
    },
    subGenres() {
      if (this.genre === -1) {
        return [];
      }
      return genres[this.genre]['GENRE COMB'] || [];
    },
    sortedSubGenres() {
      if (this.genre === -1) {
        return [];
      }
      const subGenreIds = genres[this.genre]['GENRE COMB'] || [];
      const subGenreArray = subGenreIds.map(id => genres[id]).filter(Boolean);
      return subGenreArray.sort((a, b) => {
        const nameA = a[this.genreNameKey] || a[this.genreFallbackKey] || '';
        const nameB = b[this.genreNameKey] || b[this.genreFallbackKey] || '';
        return nameA.localeCompare(nameB);
      });
    },
    mainTopic() {
      if (this.genre === -1) {
        return [];
      }

      const topicsList = [];
      const genreThemes = genres[this.genre].themes || [];
      
      for (const themeIndex of genreThemes) {
        if (this.topics[this.locale] && this.topics[this.locale][themeIndex]) {
          topicsList.push({
            key: themeIndex,
            value: this.topics[this.locale][themeIndex],
          });
        }
      }

      return topicsList;
    },
    sortedMainTopic() {
      return this.mainTopic.sort((a, b) => {
        return a.value.localeCompare(b.value);
      });
    },
    sortedLocales() {
      return this.locales.sort((a, b) => {
        return a.displayLocale.localeCompare(b.displayLocale);
      });
    },
  },
  methods: {
    t(key) {
      const currentTranslations = this.translations[this.locale] || this.translations['EN'];
      return currentTranslations[key] || key;
    },
    reset() {
      this.genre = -1;
      this.subGenre = -1;
      this.topic = -1;
      this.subTopic = -1;
      this.focus = null;
      this.align = {};
      this.priority = [];
    },
    onLanguageChange() {
      if (window.localStorage) {
        window.localStorage.setItem('latest_locale', this.locale);
      }
    },
    generateGame() {
      if (this.genre === -1) {
        this.focus = null;
        this.align = {};
        this.priority = [];
        return;
      }

      this.focus = this.getFocus(this.genre, this.subGenre);
      this.align = this.getAlign(this.genre, this.subGenre);
      this.priority = [
        genres[this.genre].GAMEPLAY || 0,
        genres[this.genre].GRAPHIC || 0,
        genres[this.genre].SOUND || 0,
        genres[this.genre].CONTROL || 0,
      ];
    },
    getAlign(mainGenre, subGenre) {
      if (!this.combinations[mainGenre] || !this.combinations[mainGenre][subGenre]) {
        return {};
      }
      const alignData = this.combinations[mainGenre][subGenre].align;
      if (Array.isArray(alignData)) {
        return alignData;
      }
      return {};
    },
    getFocus(mainGenre, subGenre) {
      if (!this.combinations[mainGenre] || !this.combinations[mainGenre][subGenre]) {
        return null;
      }
      const focusData = this.combinations[mainGenre][subGenre].focus;
      if (Array.isArray(focusData)) {
        return focusData;
      }
      return null;
    },
    formatTargetGroup(group) {
      return group.charAt(0) + group.slice(1).toLowerCase();
    },
    getFocusLabelKey(index) {
      const keys = [
        'gameLength',
        'gameDepth', 
        'beginnerFriendliness',
        'innovation',
        'story',
        'characterDesign',
        'levelDesign',
        'missionDesign'
      ];
      return keys[index] || 'gameLength';
    },
    getAlignLabelLeftKey(index) {
      const keys = ['coreGamers', 'nonviolent', 'easy'];
      return keys[index] || 'coreGamers';
    },
    getAlignLabelRightKey(index) {
      const keys = ['casualGamer', 'explicitContent', 'hard'];
      return keys[index] || 'casualGamer';
    },
    getPriorityLabelKey(index) {
      const keys = ['gameplay', 'graphics', 'sound', 'technics'];
      return keys[index] || 'gameplay';
    },
    getPriorityIcon(index) {
      const icons = [
        'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Gameplay
        'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', // Graphics
        'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z', // Sound
        'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' // Technical
      ];
      return icons[index] || icons[0];
    },
    getPriorityIconColor(index) {
      const colors = [
        'text-blue-500', // Gameplay
        'text-purple-500', // Graphics  
        'text-yellow-500', // Sound
        'text-green-500' // Technical
      ];
      return colors[index] || 'text-gray-500';
    },
  },
  mounted() {
    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showLanguages = false;
      }
    });
  },
};
</script>

<style scoped>
/* Component specific styles */
</style>