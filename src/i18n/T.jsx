import 'babel-polyfill';
import { Component } from 'react';
import PropTypes from 'prop-types';

import { defaultLocale, getMatchingLocale, languageFiles } from './i18n';

const locale = getMatchingLocale();

export const t = async (string, args = {}) => {
  const getTranslatedString = async () => {
    if (locale !== defaultLocale) {
      const languageFile = await languageFiles[locale];
      if (typeof languageFile[string] === 'string') {
        return languageFile[string];
      }
    }
    return string;
  };

  const rawString = await getTranslatedString();

  let finalString = rawString;
  Object.entries(args).forEach(([key, value]) => {
    finalString = finalString.replace(`{${key}}`, value);
  });

  return finalString;
};

export default class T extends Component {
  static propTypes = {
    children: PropTypes.string,
  }

  state = {
    translatedChildren: null,
  }

  componentDidMount() {
    this.getTranslation();
  }

  componentDidUpdate(prevProps) {
    // Update only if props changed, ignore updates from state change
    // eslint-disable-next-line react/destructuring-assignment
    if (Object.keys(this.props).some(key => this.props[key] !== prevProps[key])) {
      this.getTranslation();
    }
  }

  async getTranslation() {
    const { children, ...args } = this.props;
    const translatedChildren = await t(children, args);
    this.setState({ translatedChildren });
  }

  render() {
    const { translatedChildren } = this.state;

    return translatedChildren;
  }
}
