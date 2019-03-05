'use strict';
const profiler = require('pl-v8-profiler');
const Parser = require('./mat/Parser');
const MAX_CACHE_DEPTH = 10;

exports = module.exports = function(common) {
  const logger = common.logger('ANP-COMMON-PROFILER');
  const _profiler = {};

  function addNodesImpl(heapUsed, parser) {
    return function(realId) {
      heapUsed[realId] = parser.serializeNode(realId);
      const edgeRealIds = [];
      for (let edge of heapUsed[realId].edges) {
        const edgeName = parser.edgeUtil.getNameOrIndex(edge);
        const targetNode = parser.edgeUtil.getTargetNode(edge);
        const edgeRealId = parser.ordinalNode2realNode[targetNode];
        // edge 为已过滤的节点
        if (edgeRealId === -1) {
          continue;
        }
        edgeRealIds.push({realId: edgeRealId, edge: edgeName});
        // 没有缓存过的
        if (!heapUsed[edgeRealId]) {
          heapUsed[edgeRealId] = parser.serializeNode(edgeRealId);
        }
      }
      // edgeRealIds.sort((o, n) => parser.serializeNode(o.realId).retainedSize < parser.serializeNode(n.realId).retainedSize ? 1 : -1);
      heapUsed[realId].edges = edgeRealIds;
    };
  }
  function parse(parser) {
    const heapUsed = {};
    const result = {};
    const addNodes = addNodesImpl(heapUsed, parser);
    const leakPoints = parser.topDominators.filter((item, index) => index < 5);
    const leakMaps = leakPoints.map((point) => {
      let nowCacheDepth = 0;
      let leakMapList = parser.getLeakMap(point);
      if (!leakMapList.length) return;
      let needCacheNodesRealIdList = [
        leakMapList[leakMapList.length - 1].realId
      ];
      while (
        nowCacheDepth < MAX_CACHE_DEPTH &&
        needCacheNodesRealIdList.length > 0
      ) {
        let tmp = [];
        nowCacheDepth++;
        for (let needCacheNodeRealId of needCacheNodesRealIdList) {
          // 缓存本节点
          addNodes(needCacheNodeRealId);
          // 加入子节点
          let needCacheNode = parser.serializeNode(needCacheNodeRealId);
          for (let edge of needCacheNode.edges) {
            const targetNode = parser.edgeUtil.getTargetNode(edge);
            const edgeRealId = parser.ordinalNode2realNode[targetNode];
            // edge 为已过滤的节点
            if (edgeRealId === -1) {
              continue;
            }
            tmp.push(edgeRealId);
          }
        }
        needCacheNodesRealIdList = tmp;
      }

      return leakMapList
        .map((m, i, a) => {
          addNodes(m.realId);
          if (a.length === 1) {
            return {source: m.realId};
          }
          if (a[i + 1]) {
            addNodes(a[i + 1].realId);
            return {
              source: m.realId,
              target: a[i + 1].realId,
              edge:
                (a[i + 1].edge &&
                  parser.serializeEdge(a[i + 1].edge).nameOrIndex) ||
                false
            };
          }
          return false;
        })
        .filter((item) => item);
    });

    // rootIndex 对应的是 ordinal id
    const rootIndex = parser.rootNodeIndex;
    result.leakPoint = leakPoints;
    result.leakMaps = leakMaps;
    result.heapUsed = heapUsed;
    result.statistics = parser.statistics;
    return result;
  }
  function memory() {
    const snapshot = profiler.takeSnapshot();
    return new Promise(function(resolve, reject) {
      snapshot.export(function(error, result) {
        if (error) return reject(error);
        result =
          (typeof result === 'object' && result) ||
          common.utils.jsonParse(result);
        const parser = new Parser(result, {});
        parser.init();
        result = parse(parser);
        logger.info(result);
        snapshot.delete();
        resolve(result);
      });
    });
  }
  function init() {
    _profiler.memory = memory;
    return _profiler;
  }

  return {init};
};
