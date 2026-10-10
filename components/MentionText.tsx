import { Text } from 'react-native';
import { router } from 'expo-router';
import { canOpenProfile } from '../utils/profileLinks';

type MentionTextProps = {
  content: string;
  className?: string;
};

const TOKEN_PATTERN = /(\B@[a-zA-Z0-9_]+)/g;

export default function MentionText({ content, className }: MentionTextProps) {
  return (
    <Text className={className}>
      {content.split(TOKEN_PATTERN).map((part, index) => {
        if (!part.startsWith('@')) return <Text key={`${part}-${index}`}>{part}</Text>;
        const handle = part.slice(1).toLowerCase();
        const profileId = handle === 'raghav' ? 'player' : handle === 'theunderratedweasley' ? 'ron' : handle === 'cedricdiggory' ? 'cedric' : handle === 'dobbythefree' ? 'dobby' : handle === 'hermionegranger' ? 'hermione' : handle === 'potter' ? 'harry' : handle === 'thebestweasley' ? 'ginny' : null;
        const isLink = profileId !== null && canOpenProfile(profileId);
        return (
          <Text
            key={`${part}-${index}`}
            className="text-blue-400"
            onPress={isLink ? () => router.push({ pathname: '/user/[id]', params: { id: profileId } }) : undefined}
            accessibilityRole={isLink ? 'link' : undefined}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
}
