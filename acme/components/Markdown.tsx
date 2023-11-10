import ReactMarkdown from 'react-markdown';
import styles from './Markdown.module.css';

export const Markdown = ({ children }: { children: string | null | undefined }) => {
  return (
    <ReactMarkdown className={styles.markdown}>{children}</ReactMarkdown>
  );
};