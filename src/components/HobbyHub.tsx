import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import HobbyCategoryCard from './HobbyCategoryCard';
import PageHeader from './PageHeader';
import RelatedPosts from './RelatedPosts';
import type { HobbyCategory, HobbyCategoryId } from '../data/hobbies';
import type { PostSummary } from '../data/posts';

interface Props {
  categories: HobbyCategory[];
  counts: Record<HobbyCategoryId, number>;
  posts: PostSummary[];
}

export default function HobbyHub({ categories, counts, posts }: Props) {
  return (
    <ThemeRoot>
      <PageHeader title="興趣" description="工作之外的紀錄：遊戲、閱讀與影劇、攝影與旅行。" />
      <CardGrid>
        {categories.map((category) => (
          <li key={category.id}>
            <HobbyCategoryCard
              category={category}
              countLabel={
                counts[category.id] > 0
                  ? `${counts[category.id]} ${category.id === 'photos' ? '本相簿' : '筆紀錄'}`
                  : undefined
              }
            />
          </li>
        ))}
      </CardGrid>
      <RelatedPosts posts={posts} />
    </ThemeRoot>
  );
}
