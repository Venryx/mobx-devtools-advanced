import {ActionsStore} from "./ActionsStore";
import UpdatesHighlighterStore from "./UpdatesHighlighterStore";
import {TreeExplorerStore} from "./TreeExplorerStore";
import MSTChangesStore from "./MSTChangesStore";
import CapabilitiesStore from "./CapabilitiesStore";

export default bridge=>({
  actionsLoggerStore: new ActionsStore(bridge),
  updatesHighlighterStore: new UpdatesHighlighterStore(bridge),
  mstLoggerStore: new MSTChangesStore(bridge),
  treeExplorerStore: new TreeExplorerStore(bridge),
  capabilitiesStore: new CapabilitiesStore(bridge),
});