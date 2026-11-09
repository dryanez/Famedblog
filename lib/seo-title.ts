// Keep <title> within ~60 characters: add the brand suffix only when it fits.
const SUFFIX = ' | FaMED Prep';
export function seoTitle(title: string) {
  return title.length + SUFFIX.length <= 60 ? title : { absolute: title };
}
