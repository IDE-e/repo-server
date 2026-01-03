export class CategoryDto {
  id!: string;
  label!: string;
  activeByDefault!: boolean;
}

export class GalleryMetaDto {
  title!: string;
  version!: string;
  updatedAt!: string; // ISO-8601
}

export class ButtonSectionBaseDto {
  description!: string;
  variants!: string[];
}

export class ButtonSectionDto extends ButtonSectionBaseDto {
  usageTemplate!: string;
}

export class BadgeExampleDto {
  label!: string;
  tone!: string;
  icon!: string;
}

export class BadgeSectionDto {
  description!: string;
  examples!: BadgeExampleDto[];
  usageSnippet!: string;
}

export class InfoCardExampleDto {
  title!: string;
  value!: string;
  hint!: string;
  tone!: string;
}

export class InfoCardSectionDto {
  description!: string;
  examples!: InfoCardExampleDto[];
  usageSnippet!: string;
}

export class GalleryStoreDto {
  meta!: GalleryMetaDto;
  categories!: CategoryDto[];
  button!: ButtonSectionBaseDto;
  badge!: BadgeSectionDto;
  infoCard!: InfoCardSectionDto;
}

export class GalleryPayloadDto {
  meta!: GalleryMetaDto;
  categories!: CategoryDto[];
  button!: ButtonSectionDto;
  badge!: BadgeSectionDto;
  infoCard!: InfoCardSectionDto;
}
