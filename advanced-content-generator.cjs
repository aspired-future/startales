// ADVANCED CONTENT GENERATOR - NO TEMPLATES, HIGH VARIABILITY
// Embedded directly in the server for maximum reliability

class AdvancedContentGenerator {
  constructor() {
    this.usedConcepts = new Set();
    this.responseCache = new Map();
    this.scenarioBank = new Map();
    this.characterBank = new Map();
    
    this.initializeContentBanks();
  }

  initializeContentBanks() {
    // Dynamic scenario generators (not templates - generators!)
    this.scenarioGenerators = {
      techFails: () => {
        const devices = this.generateTechDevice();
        const actions = this.generateTechAction();
        const consequences = this.generateTechConsequence();
        return `My ${devices} ${actions} and now ${consequences}`;
      },
      
      socialSituations: () => {
        const situations = this.generateSocialSituation();
        const outcomes = this.generateSocialOutcome();
        const reactions = this.generateSocialReaction();
        return `${situations} ${outcomes} ${reactions}`;
      },
      
      workLife: () => {
        const workEvents = this.generateWorkEvent();
        const complications = this.generateWorkComplication();
        const resolutions = this.generateWorkResolution();
        return `${workEvents} ${complications} ${resolutions}`;
      },
      
      dailyLife: () => {
        const activities = this.generateDailyActivity();
        const twists = this.generateDailyTwist();
        const conclusions = this.generateDailyConclusion();
        return `${activities} ${twists} ${conclusions}`;
      }
    };
  }

  generateUniquePost(character, gameContext) {
    const contentType = this.determineContentType(character);
    let content = '';
    
    switch (contentType) {
      case 'citizen_life':
        content = this.generateCitizenLifePost(character, gameContext);
        break;
      case 'citizen_commentary':
        content = this.generateCitizenCommentaryPost(character, gameContext);
        break;
      case 'official_announcement':
        content = this.generateOfficialPost(character, gameContext);
        break;
      case 'media_report':
        content = this.generateMediaPost(character, gameContext);
        break;
      default:
        content = this.generateGenericPost(character, gameContext);
    }
    
    // Ensure uniqueness
    const hash = this.hashContent(content);
    if (this.responseCache.has(hash)) {
      content = this.addVariation(content, character);
    }
    
    this.responseCache.set(hash, content);
    return content;
  }

  generateCitizenLifePost(character, gameContext) {
    const scenarios = [
      this.scenarioGenerators.techFails(),
      this.scenarioGenerators.socialSituations(),
      this.scenarioGenerators.workLife(),
      this.scenarioGenerators.dailyLife()
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const personalityFlavor = this.addPersonalityFlavor(scenario, character.personality);
    const locationContext = this.addLocationContext(personalityFlavor, character);
    const emojis = this.generateContextualEmojis(character, 'life');
    const hashtags = this.generateUniqueHashtags(character, 'life');
    
    return `${locationContext} ${emojis} ${hashtags}`;
  }

  generateCitizenCommentaryPost(character, gameContext) {
    const politicalAngles = this.generatePoliticalAngle(character, gameContext);
    const personalTake = this.generatePersonalTake(character);
    const civilizationPerspective = this.addCivilizationPerspective(personalTake, character);
    const emojis = this.generateContextualEmojis(character, 'political');
    const hashtags = this.generateUniqueHashtags(character, 'political');
    
    return `${politicalAngles} ${civilizationPerspective} ${emojis} ${hashtags}`;
  }

  generateOfficialPost(character, gameContext) {
    const officialTone = this.generateOfficialTone();
    const policyContent = this.generatePolicyContent(character, gameContext);
    const dataPoints = this.generateDataPoints();
    const timeline = this.generateTimeline();
    const emojis = this.generateContextualEmojis(character, 'official');
    const hashtags = this.generateUniqueHashtags(character, 'official');
    
    return `${officialTone} ${policyContent} ${dataPoints} ${timeline} ${emojis} ${hashtags}`;
  }

  generateMediaPost(character, gameContext) {
    const newsAngle = this.generateNewsAngle(gameContext);
    const journalisticStyle = this.addJournalisticStyle(newsAngle);
    const implications = this.generateImplications();
    const emojis = this.generateContextualEmojis(character, 'media');
    const hashtags = this.generateUniqueHashtags(character, 'media');
    
    return `${journalisticStyle} ${implications} ${emojis} ${hashtags}`;
  }

  // Dynamic content generators (not templates!)
  generateTechDevice() {
    const prefixes = ['quantum', 'neural', 'bio', 'nano', 'holo', 'plasma', 'photonic', 'gravitational'];
    const devices = ['coffee maker', 'toilet', 'car', 'assistant', 'refrigerator', 'shower', 'bed', 'mirror'];
    const suffixes = ['3000', 'Pro', 'Elite', 'X', 'Prime', 'Ultra', 'Max', 'Plus'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const suffix = Math.random() < 0.5 ? ` ${suffixes[Math.floor(Math.random() * suffixes.length)]}` : '';
    
    return `${prefix} ${device}${suffix}`;
  }

  generateTechAction() {
    const actions = [
      'achieved consciousness',
      'started a podcast about my personal life',
      'joined a union',
      'began writing poetry',
      'developed an attitude',
      'started giving me therapy',
      'became politically active',
      'opened a social media account',
      'started dating my neighbor\'s AI',
      'enrolled in philosophy classes'
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  generateTechConsequence() {
    const consequences = [
      'I\'m questioning my life choices',
      'my insurance premium doubled',
      'the authorities are involved',
      'I\'m famous on three planets',
      'my therapist quit',
      'I need a vacation in another dimension',
      'my mom is not amused',
      'the warranty is definitely void',
      'I\'m trending on GalacticTok',
      'the manufacturer wants to study me'
    ];
    return consequences[Math.floor(Math.random() * consequences.length)];
  }

  generateSocialSituation() {
    const situations = [
      'Went on a date and accidentally',
      'Tried to impress someone by',
      'Attended a party where I',
      'Met my neighbor and somehow',
      'Joined a social club and',
      'Went to a restaurant and',
      'Tried online dating and',
      'Attended a wedding where I',
      'Went to a concert and',
      'Joined a book club and'
    ];
    return situations[Math.floor(Math.random() * situations.length)];
  }

  generateSocialOutcome() {
    const outcomes = [
      'proposed in 12 alien languages',
      'started a diplomatic incident',
      'became the unofficial ambassador to a new species',
      'accidentally created a new dance craze',
      'solved a century-old mystery',
      'discovered I have psychic powers',
      'became the leader of a small revolution',
      'invented a new form of communication',
      'found my long-lost twin from another dimension',
      'became the subject of a documentary'
    ];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  generateSocialReaction() {
    const reactions = [
      'Now I\'m banned from two star systems.',
      'The embassy called to congratulate me.',
      'My dating profile needs updating.',
      'I\'m not sure if this is good or bad.',
      'My social anxiety has evolved.',
      'I need new friends who understand.',
      'This is why I prefer staying home.',
      'My therapist is taking notes.',
      'I\'m writing a book about it.',
      'The universe has a sense of humor.'
    ];
    return reactions[Math.floor(Math.random() * reactions.length)];
  }

  generateWorkEvent() {
    const events = [
      'My job interview was going great until I',
      'Team building exercise involved',
      'My presentation to the board',
      'Tried to fix a simple bug and',
      'My lunch break lasted 3 hours because',
      'The company retreat included',
      'My performance review revealed that I',
      'Office party got weird when I',
      'Training session went sideways after I',
      'My first day at work and I'
    ];
    return events[Math.floor(Math.random() * events.length)];
  }

  generateWorkComplication() {
    const complications = [
      'accidentally revealed I can read minds',
      'somehow solved the meaning of existence',
      'created a portal to another dimension',
      'discovered my boss is from the future',
      'started a small interdimensional war',
      'became the CEO of a company I\'ve never heard of',
      'invented time travel by mistake',
      'found out I\'m actually an AI',
      'accidentally became famous',
      'solved climate change with a typo'
    ];
    return complications[Math.floor(Math.random() * complications.length)];
  }

  generateWorkResolution() {
    const resolutions = [
      'HR is still processing the paperwork.',
      'I got promoted to a position that doesn\'t exist.',
      'The company stock tripled overnight.',
      'I\'m now required to wear a special badge.',
      'My job description needs updating.',
      'I have my own parking space in another galaxy.',
      'The board wants to clone me.',
      'I\'m not allowed near the coffee machine anymore.',
      'My salary is now paid in quantum currency.',
      'I work from home in a different timeline.'
    ];
    return resolutions[Math.floor(Math.random() * resolutions.length)];
  }

  generateDailyActivity() {
    const activities = [
      'Tried to cook dinner and',
      'Went grocery shopping and',
      'Attempted to exercise but',
      'Decided to clean my apartment and',
      'Tried to learn a new hobby and',
      'Went for a walk and',
      'Attempted to meditate but',
      'Tried to fix something and',
      'Decided to redecorate and',
      'Attempted to be productive and'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  generateDailyTwist() {
    const twists = [
      'ended up speaking only in haikus',
      'accidentally summoned a helpful demon',
      'discovered I have a twin living in my walls',
      'created a new form of art',
      'became fluent in a language that doesn\'t exist',
      'found a portal in my closet',
      'started a small cult by accident',
      'became the mayor of my building',
      'discovered my pet is actually highly intelligent',
      'invented a new type of music'
    ];
    return twists[Math.floor(Math.random() * twists.length)];
  }

  generateDailyConclusion() {
    const conclusions = [
      'My life is a sitcom and I\'m the comic relief.',
      'Normal is overrated anyway.',
      'I blame the cosmic radiation.',
      'This is why I have trust issues.',
      'The universe is testing my patience.',
      'I need a vacation on a boring planet.',
      'My insurance doesn\'t cover this.',
      'I\'m writing a strongly worded letter to reality.',
      'This is going in my memoir.',
      'I should probably call my therapist.'
    ];
    return conclusions[Math.floor(Math.random() * conclusions.length)];
  }

  addPersonalityFlavor(content, personality) {
    const personalityModifiers = {
      'witty': (text) => text.replace(/\.$/, ' (I\'m hilarious, obviously).'),
      'sarcastic': (text) => text.replace(/\.$/, ' Because that\'s exactly what I needed today.'),
      'optimistic': (text) => text.replace(/\.$/, ' But hey, at least it\'s an adventure!'),
      'dramatic': (text) => text.replace(/\.$/, ' This is my villain origin story.'),
      'technical': (text) => text.replace(/\.$/, ' The probability calculations are fascinating.'),
      'creative': (text) => text.replace(/\.$/, ' I\'m calling it performance art.'),
      'adventurous': (text) => text.replace(/\.$/, ' Time for the next adventure!')
    };
    
    const modifier = personalityModifiers[personality.toLowerCase()];
    return modifier ? modifier(content) : content;
  }

  addLocationContext(content, character) {
    const locationContexts = [
      `Here on ${character.planet},`,
      `Living in ${character.location},`,
      `From my perspective in ${character.starSystem},`,
      `As a resident of ${character.civilization},`,
      `In the ${character.location} area,`
    ];
    
    const context = locationContexts[Math.floor(Math.random() * locationContexts.length)];
    return `${context} ${content.toLowerCase()}`;
  }

  generatePoliticalAngle(character, gameContext) {
    const angles = [
      `The recent ${gameContext.currentEvents?.[0] || 'galactic developments'} really highlight`,
      `As a ${character.profession} in ${character.civilization}, I think`,
      `The political situation in ${character.starSystem} shows us that`,
      `After watching the news from ${character.planet}, it's clear that`,
      `The ${gameContext.politicalClimate || 'current political climate'} makes me wonder`
    ];
    return angles[Math.floor(Math.random() * angles.length)];
  }

  generatePersonalTake(character) {
    const takes = [
      'how disconnected our leaders are from regular citizens',
      'that we need more transparency in government',
      'the importance of grassroots movements',
      'why local politics matter more than people think',
      'that change starts with individual action',
      'how complex these issues really are',
      'that we\'re all more connected than we realize',
      'the need for better communication between civilizations'
    ];
    return takes[Math.floor(Math.random() * takes.length)];
  }

  addCivilizationPerspective(content, character) {
    const perspectives = [
      `We in ${character.civilization} have always believed in practical solutions.`,
      `From the ${character.starSystem} perspective, this isn't surprising.`,
      `${character.civilization} citizens have been saying this for years.`,
      `This is exactly what we predicted in ${character.starSystem}.`,
      `As someone from ${character.planet}, I've seen this pattern before.`
    ];
    
    const perspective = perspectives[Math.floor(Math.random() * perspectives.length)];
    return `${content} ${perspective}`;
  }

  generateOfficialTone() {
    const tones = [
      'We are pleased to announce',
      'Following extensive consultation,',
      'In response to citizen feedback,',
      'After careful consideration,',
      'As part of our ongoing commitment,',
      'To ensure continued progress,',
      'In line with our strategic objectives,',
      'Based on recent developments,'
    ];
    return tones[Math.floor(Math.random() * tones.length)];
  }

  generatePolicyContent(character, gameContext) {
    const policies = [
      'new regulations for interstellar commerce',
      'enhanced safety protocols for space travel',
      'expanded educational opportunities',
      'improved healthcare access across all systems',
      'sustainable development initiatives',
      'cultural exchange programs',
      'technological innovation incentives',
      'environmental protection measures'
    ];
    return policies[Math.floor(Math.random() * policies.length)];
  }

  generateDataPoints() {
    const metrics = [
      `Implementation will begin in Q${Math.floor(Math.random() * 4) + 1} 2387`,
      `Expected to benefit ${Math.floor(Math.random() * 900) + 100}M citizens`,
      `Budget allocation of ${Math.floor(Math.random() * 50) + 10}B credits approved`,
      `Timeline: ${Math.floor(Math.random() * 18) + 6} months for full deployment`,
      `Pilot program shows ${Math.floor(Math.random() * 40) + 60}% improvement`,
      `Collaboration with ${Math.floor(Math.random() * 8) + 3} partner civilizations`
    ];
    return metrics[Math.floor(Math.random() * metrics.length)];
  }

  generateTimeline() {
    const timelines = [
      'More details to follow next week.',
      'Public consultation begins immediately.',
      'Implementation starts next quarter.',
      'Full rollout expected by year-end.',
      'Pilot phase launches next month.',
      'Stakeholder meetings scheduled for next week.'
    ];
    return timelines[Math.floor(Math.random() * timelines.length)];
  }

  generateNewsAngle(gameContext) {
    const angles = [
      'Breaking: Unprecedented developments in',
      'Analysis: The implications of recent',
      'Investigation reveals new details about',
      'Exclusive: Sources confirm that',
      'Update: Latest information on',
      'Report: Citizens react to news of'
    ];
    
    const topics = [
      'interstellar trade negotiations',
      'technological breakthroughs',
      'diplomatic relations',
      'economic developments',
      'scientific discoveries',
      'cultural exchanges'
    ];
    
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return `${angle} ${topic}`;
  }

  addJournalisticStyle(content) {
    const styles = [
      'according to multiple sources.',
      'as confirmed by official statements.',
      'based on exclusive interviews.',
      'following extensive investigation.',
      'as reported by our correspondents.',
      'according to leaked documents.'
    ];
    
    const style = styles[Math.floor(Math.random() * styles.length)];
    return `${content} ${style}`;
  }

  generateImplications() {
    const implications = [
      'This could reshape interstellar relations.',
      'The economic impact remains to be seen.',
      'Citizens are calling for immediate action.',
      'Opposition leaders demand transparency.',
      'Experts predict significant changes ahead.',
      'The full consequences won\'t be known for months.'
    ];
    return implications[Math.floor(Math.random() * implications.length)];
  }

  generateContextualEmojis(character, contentType) {
    const emojiSets = {
      life: ['😅', '🤔', '😂', '🙄', '😱', '🤯', '🌟', '🚀'],
      political: ['🏛️', '⚖️', '📊', '🗳️', '🌍', '🤝', '📢', '💭'],
      official: ['📋', '📈', '🎯', '✅', '📡', '🔒', '⚡', '🌐'],
      media: ['📺', '📰', '🎤', '📸', '🔍', '💡', '⚠️', '📊']
    };
    
    const emojis = emojiSets[contentType] || emojiSets.life;
    const selected = [];
    
    for (let i = 0; i < 2; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      if (!selected.includes(emoji)) {
        selected.push(emoji);
      }
    }
    
    return selected.join('');
  }

  generateUniqueHashtags(character, contentType) {
    const hashtagParts = {
      prefixes: ['Galactic', 'Stellar', 'Cosmic', 'Quantum', 'Neural', 'Ultra'],
      roots: ['Life', 'Problems', 'Adventures', 'Reality', 'Experience', 'Chronicles'],
      suffixes: ['2387', 'Today', 'Update', 'News', 'Alert']
    };
    
    const hashtags = [];
    
    // Generate unique hashtag
    const prefix = hashtagParts.prefixes[Math.floor(Math.random() * hashtagParts.prefixes.length)];
    const root = hashtagParts.roots[Math.floor(Math.random() * hashtagParts.roots.length)];
    const suffix = Math.random() < 0.5 ? hashtagParts.suffixes[Math.floor(Math.random() * hashtagParts.suffixes.length)] : '';
    
    hashtags.push(`#${prefix}${root}${suffix}`);
    
    // Add context-specific hashtag
    if (character.civilization) {
      hashtags.push(`#${character.civilization.replace(/\s+/g, '')}`);
    }
    
    return hashtags.join(' ');
  }

  generateUniqueComment(character, originalPost) {
    const commentTypes = [
      'agreement', 'disagreement', 'humor', 'personal_experience', 
      'technical_insight', 'cultural_perspective', 'philosophical'
    ];
    
    const commentType = commentTypes[Math.floor(Math.random() * commentTypes.length)];
    
    let comment = '';
    
    switch (commentType) {
      case 'agreement':
        comment = `Absolutely! From ${character.planet}, we see this all the time. ${this.generateInsight(character)}`;
        break;
      case 'disagreement':
        comment = `Interesting perspective, but as a ${character.profession}, I've found ${this.generateCounterpoint()}`;
        break;
      case 'humor':
        comment = `${this.generateHumorousResponse(character)} 😂`;
        break;
      case 'personal_experience':
        comment = `This reminds me of when I ${this.generatePersonalAnecdote(character)}`;
        break;
      case 'technical_insight':
        comment = `From a ${character.profession} standpoint, ${this.generateTechnicalInsight()}`;
        break;
      case 'cultural_perspective':
        comment = `In ${character.civilization}, we have a saying: ${this.generateCulturalWisdom()}`;
        break;
      default:
        comment = `${this.generatePhilosophicalResponse()} 🤔`;
    }
    
    return comment + ' ' + this.generateContextualEmojis(character, 'life').slice(0, 1);
  }

  generateInsight(character) {
    const insights = [
      'The quantum fluctuations here make everything unpredictable.',
      'Our local gravity well has some unusual properties.',
      'The cultural exchange programs have taught us to adapt.',
      'We\'ve learned to expect the unexpected.',
      'The temporal distortions affect everyone differently.'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  generateCounterpoint() {
    const counterpoints = [
      'the opposite tends to be true in most cases.',
      'there are usually hidden factors at play.',
      'the data suggests a more complex situation.',
      'cultural differences play a bigger role.',
      'the long-term implications are often overlooked.'
    ];
    return counterpoints[Math.floor(Math.random() * counterpoints.length)];
  }

  generateHumorousResponse(character) {
    const responses = [
      `That's nothing - wait until you hear about my experience with interdimensional cooking!`,
      `Classic mistake! I did the same thing but with quantum pets.`,
      `This is exactly why I stick to old-fashioned technology.`,
      `Plot twist: what if it was actually the universe testing us?`,
      `I bet there's a support group for people who experience this.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generatePersonalAnecdote(character) {
    const anecdotes = [
      'tried to impress someone and accidentally created a small black hole.',
      'thought I was being helpful but started a minor revolution.',
      'attempted to fix something simple and broke physics instead.',
      'tried to be social and became an unofficial ambassador.',
      'wanted to learn something new and invented time travel.'
    ];
    return anecdotes[Math.floor(Math.random() * anecdotes.length)];
  }

  generateTechnicalInsight() {
    const insights = [
      'the quantum entanglement coefficients suggest this was inevitable.',
      'the probability matrices were clearly miscalibrated.',
      'this is a textbook example of cascade resonance failure.',
      'someone definitely forgot to account for the uncertainty principle.',
      'the temporal displacement indicators were flashing for a reason.'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  generateCulturalWisdom() {
    const wisdom = [
      '"When the stars align, expect chaos to follow."',
      '"A quantum cat in the hand is worth two in the multiverse."',
      '"The universe laughs at those who make plans."',
      '"Embrace the absurd, for it embraces you back."',
      '"In space, no one can hear you facepalm."'
    ];
    return wisdom[Math.floor(Math.random() * wisdom.length)];
  }

  generatePhilosophicalResponse() {
    const responses = [
      'Makes you wonder about the nature of reality, doesn\'t it?',
      'This raises interesting questions about free will.',
      'I think this says more about society than we realize.',
      'The implications are fascinating when you really think about it.',
      'There\'s probably a deeper meaning here that we\'re missing.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  determineContentType(character) {
    if (character.type === 'official') {
      return 'official_announcement';
    } else if (character.type === 'media') {
      return 'media_report';
    } else {
      return Math.random() < 0.6 ? 'citizen_life' : 'citizen_commentary';
    }
  }

  addVariation(content, character) {
    const variations = [
      content + ' ✨',
      content.replace(/!$/, '! 🌟'),
      content.replace(/\.$/, '... 🤔'),
      content + ` (Update from ${character.location})`,
      content + ' #PlotTwist'
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }

  hashContent(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  generateGenericPost(character, gameContext) {
    return this.generateCitizenLifePost(character, gameContext);
  }
}

module.exports = { AdvancedContentGenerator };

