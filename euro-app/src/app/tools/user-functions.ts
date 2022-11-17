import { Group } from "../models/group.model";
import { User } from "../models/user.model";
import { StringMapping } from "./mappings";

export function browseableGroups(user: User | null, isSuper: boolean, allGroups: StringMapping<Group>): Group[] {
    if (user === null) return [];
    if (isSuper) return Object.values(allGroups);

    const groups = (user.groups??[]).map(id => allGroups[id]);
    return groups;
}