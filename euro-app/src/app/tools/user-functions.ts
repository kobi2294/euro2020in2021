import { Group } from "../models/group.model";
import { User } from "../models/user.model";
import { StringMapping } from "./mappings";

export function browseableGroups(user: User | null, allGroups: StringMapping<Group>): Group[] {
    if (user === null) return [];
    if (Boolean(user.super)) return Object.values(allGroups);

    const groups = (user.groups??[]).map(id => allGroups[id]);
    return groups;
}