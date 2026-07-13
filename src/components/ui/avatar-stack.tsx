// Re-export module so the documented path (MAPPING.md, docs/components) resolves.
// The implementation lives in ./avatar to keep Avatar + AvatarStack co-located and
// share the avatarVariants CVA. Importing from either path is supported.
export { AvatarStack, Avatar, avatarVariants } from "./avatar"
