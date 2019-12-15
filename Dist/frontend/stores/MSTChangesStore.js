"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractStore_1 = __importDefault(require("./AbstractStore"));
const preferences_1 = __importDefault(require("../../preferences"));
class MSTChangesStore extends AbstractStore_1.default {
    constructor(bridge) {
        super();
        this.mstLogEnabled = false;
        this.itemsDataByRootId = {};
        this.rootNamesById = {};
        this.bridge = bridge;
        this.addDisposer(bridge.sub("frontend:append-mst-log-items", newLogItem => {
            const { rootId } = newLogItem;
            if (!this.itemsDataByRootId[rootId]) {
                if (!this.activeRootId) {
                    this.activeRootId = rootId;
                    this.emit("activeRootId");
                }
                this.itemsDataByRootId[rootId] = Object.create(null);
                this.itemsDataByRootId[rootId].logItemsIds = [];
                this.itemsDataByRootId[rootId].logItemsById = {};
            }
            const itemData = this.itemsDataByRootId[rootId];
            if (newLogItem.length > 500) {
                this.spliceLogItems(rootId, 0, itemData.logItemsIds.length - 480);
            }
            itemData.activeLogItemId = newLogItem.id;
            itemData.activeLogItemIndex = itemData.logItemsIds.length;
            itemData.logItemsIds.push(newLogItem.id);
            itemData.logItemsById[newLogItem.id] = newLogItem;
            this.emit("activeLogItemId");
            this.emit("mstLogItems");
            this.selectLogItemId(newLogItem.id);
        }), bridge.sub("mst-log-item-details", logItem => {
            const itemData = this.itemsDataByRootId[logItem.rootId];
            if (!itemData)
                return;
            itemData.logItemsById[logItem.id] = logItem;
            this.emit(logItem.id);
        }), bridge.sub("frontend:mst-roots", roots => {
            roots.forEach(({ id, name }) => {
                this.rootNamesById[id] = name;
            });
            this.emit("mstRootsUpdated");
        }), bridge.sub("frontend:remove-mst-root", rootId => {
            delete this.rootNamesById[rootId];
            delete this.itemsDataByRootId[rootId];
            this.emit("mstRootsUpdated");
        }));
        preferences_1.default.get("mstLogEnabled").then(({ mstLogEnabled = true }) => {
            if (mstLogEnabled)
                this.toggleMstLogging(true);
        });
    }
    toggleMstLogging(mstLogEnabled = !this.mstLogEnabled) {
        if (mstLogEnabled !== this.mstLogEnabled) {
            this.mstLogEnabled = mstLogEnabled;
            preferences_1.default.set({ mstLogEnabled });
            this.emit("mstLogEnabled");
            this.bridge.send("backend-mst:set-tracking-enabled", mstLogEnabled);
        }
    }
    commitAll() {
        Object.keys(this.itemsDataByRootId).forEach(rootId => {
            this.spliceLogItems(rootId, 0, this.itemsDataByRootId[rootId].logItemsIds.length - 1);
        });
        this.emit("mstLogItems");
    }
    spliceLogItems(rootId, startIndex = 0, endIndex = Infinity) {
        const itemData = this.itemsDataByRootId[rootId];
        if (!itemData)
            return;
        const { logItemsIds } = itemData;
        const removedItemsIds = logItemsIds.splice(startIndex, endIndex);
        removedItemsIds.forEach(id => {
            delete itemData.logItemsById[id];
        });
        if (itemData.selectLogItemId && removedItemsIds.indexOf(itemData.selectedLogItemId) !== -1) {
            this.selectLogItemId(undefined);
        }
        this.bridge.send("backend-mst:forget-mst-items", { rootId, itemsIds: removedItemsIds });
    }
    activateRootId(rootId) {
        this.activeRootId = rootId;
        this.emit("activeRootId");
    }
    activateLogItemId(logItemId) {
        const rootId = this.activeRootId;
        const itemData = this.itemsDataByRootId[rootId];
        if (!itemData)
            return;
        this.bridge.send("backend-mst:activate-log-item-id", { rootId, logItemId });
        itemData.activeLogItemId = logItemId;
        itemData.activeLogItemIndex = itemData.logItemsIds.indexOf(logItemId);
        this.emit("activeLogItemId");
    }
    commitLogItemId(logItemId) {
        this.activateLogItemId(logItemId);
        const rootId = this.activeRootId;
        const itemData = this.itemsDataByRootId[rootId];
        if (!itemData)
            return;
        const idx = itemData.logItemsIds.indexOf(logItemId);
        if (idx !== -1) {
            this.spliceLogItems(rootId, 0, idx);
        }
        this.emit("mstLogItems");
    }
    cancelLogItemId(logItemId) {
        this.activateLogItemId(logItemId);
        const rootId = this.activeRootId;
        const itemData = this.itemsDataByRootId[rootId];
        if (!itemData)
            return;
        const idx = itemData.logItemsIds.indexOf(logItemId);
        if (idx !== -1 && idx !== 0) {
            this.activateLogItemId(itemData.logItemsIds[idx - 1]);
            this.spliceLogItems(rootId, idx);
        }
        this.emit("mstLogItems");
    }
    selectLogItemId(logItemId) {
        const rootId = this.activeRootId;
        const itemData = this.itemsDataByRootId[rootId];
        if (!itemData)
            return;
        itemData.selectedLogItemId = logItemId;
        this.emit("selectedLogItemId");
        this.getDetails(logItemId);
    }
    getDetails(logItemId) {
        this.bridge.send("get-mst-log-item-details", {
            rootId: this.activeRootId,
            logItemId,
        });
    }
}
exports.default = MSTChangesStore;
