import { useTranslation } from 'react-i18next';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  return (
    <select
      aria-label="Language selector"
      className="border p-2 rounded"
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value)}
    >
      {languages.map(l => (
        <option key={l.value} value={l.value}>{l.label}</option>
      ))}
    </select>
  );
}
