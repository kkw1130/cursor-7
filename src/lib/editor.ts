import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

// 공유 Tiptap 확장 기능 설정
export const extensions = [
  StarterKit,
  Image.extend({
    addAttributes() {
      return {
        src: {
          default: null,
        },
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
      };
    },
  }).configure({
    HTMLAttributes: {
      class: 'rounded-lg max-w-full h-auto',
    },
    allowBase64: false,
    inline: false,
  }),
];
