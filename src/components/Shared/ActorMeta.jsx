import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";

import SecurityIcon from "@mui/icons-material/Security";
import BlockIcon from "@mui/icons-material/Block";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import GroupOffIcon from "@mui/icons-material/GroupOff";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";

import { SquareChip, UserAvatar, FediverseChipLink } from "../Display.jsx";
import { UserTooltip } from "../Tooltip.jsx";

import { parseActorId } from "../../utils.js";

import { getSiteData } from "../../hooks/getSiteData";
import { useLemmyHttp } from "../../hooks/useLemmyHttp";

import { PersonMetaChips } from "./UserChips.jsx";

import {
  setConfigItem,
  selectBlurNsfw,
  selectShowAvatars,
  selectNsfwWords,
} from "../../redux/reducer/configReducer";
import { useNavigate } from "react-router-dom";

export function PersonMetaLine({ creator, by = false, sx }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const showAvatars = useSelector(selectShowAvatars);

  const actorInstanceBaseUrl = creator.actor_id.split("/")[2];
  const fediverseUserLink = creator.actor_id;

  // console.log("creator", creator);

  let localUserLink = `https://${baseUrl}/u/${creator.name}`;
  if (baseUrl != actorInstanceBaseUrl) localUserLink = `${localUserLink}@${actorInstanceBaseUrl}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        py: 0.5,
        ...sx,
      }}
    >
      <Box
        sx={{
          fontSize: "14px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {by && <Typography sx={{ pr: 1 }}>by</Typography>}
        {showAvatars && <UserAvatar source={creator.avatar} />}
        {creator.display_name && (
          <Typography sx={{ fontSize: "15px", px: 1 }}>{creator.display_name}</Typography>
        )}
        <Tooltip placement="top-start" variant="outlined" title={<UserTooltip user={creator} />} arrow>
          <Link href={localUserLink} target="_blank" rel="noopener noreferrer" sx={{ pb: 0.7, pl: 1 }}>
            <Typography component="span" sx={{ mr: 0.25 }}>
              {creator.name}
            </Typography>
            {baseUrl != actorInstanceBaseUrl && (
              <Typography component="span">@{creator.actor_id.split("/")[2]}</Typography>
            )}
          </Link>
        </Tooltip>
      </Box>

      {/* Post Author Meta */}
      <PersonMetaChips person={creator} />
    </Box>
  );
}

export function PersonMetaTitle({ creator, sx }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const actorInstanceBaseUrl = creator.actor_id.split("/")[2];

  // console.log("creator", creator);

  let localUserLink = `https://${baseUrl}/u/${creator.name}`;
  if (baseUrl != actorInstanceBaseUrl) localUserLink = `${localUserLink}@${actorInstanceBaseUrl}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        py: 0.0,
        ...sx,
      }}
    >
      <Box
        sx={{
          fontSize: "14px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* <Link href={creator.actor_id} target="_blank" rel="noopener noreferrer" sx={{ pb: 0.7, pl: 1 }}> */}
        <Typography component="span" sx={{ mr: 0.25 }}>
          {creator.name}
        </Typography>

        {baseUrl != actorInstanceBaseUrl && (
          <Typography component="span">@{creator.actor_id.split("/")[2]}</Typography>
        )}
        {/* </Link> */}
      </Box>

      {/* Post Author Meta */}
      {/* <PersonMetaChips person={creator} /> */}
    </Box>
  );
}

const getLocalCommunityModeratorIndicator = (communityData) => {
  const localModeratorCount = communityData.moderators.filter(
    (m) => m.moderator.local && !m.moderator.banned && !m.moderator.deleted,
  ).length;
  if (localModeratorCount > 0) {
    return (
      <SquareChip
        color={"success"}
        tooltip={`Community has ${localModeratorCount} local moderator${localModeratorCount > 1 ? "s" : ""}`}
        iconOnly={<GroupIcon fontSize="small" />}
      />
    );
  } else {
    return (
      <SquareChip
        color={"warning"}
        tooltip="Community has no local moderators"
        iconOnly={<GroupOffIcon fontSize="small" />}
      />
    );
  }
};

export function CommunityMetaLine({ community, showIn = false, sx }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();
  const navigate = useNavigate();
  const actorInstanceBaseUrl = community.actor_id.split("/")[2];
  const fediverseCommunityLink = community.actor_id;

  console.log("community", actorInstanceBaseUrl, fediverseCommunityLink);

  const redirectToModlogCommunity = (community) => {
    navigate(`/actions?community_id=${community.id}`);
  }

  let localCommunityLink = `https://${baseUrl}/c/${community.name}`;
  if (baseUrl != actorInstanceBaseUrl) localCommunityLink = `${localCommunityLink}@${actorInstanceBaseUrl}`;

  const isAdmin = userRole === "admin";

  const {
    isLoading: communityLoading,
    isFetching: communityFetching,
    error: communityError,
    data: communityData,
  } = useLemmyHttp(
    "getCommunity",
    {
      id: community.id,
    },
    isAdmin,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        ...sx,
      }}
    >
      <Typography
        variant="body3"
        component="p"
        sx={{
          fontSize: "14px",
          overflow: "hidden",
        }}
      >
        {showIn && "in "}
        {community.title && `${community.title} `}
        <Tooltip
          placement="top"
          variant="outlined"
          title={baseUrl == actorInstanceBaseUrl ? "Local Community" : "Remote Community"}
          sx={{
            cursor: "pointer",
          }}
          onClick={() => {
            redirectToModlogCommunity(community)
          }}
          arrow
        >
          <Link href={localCommunityLink} target="_blank" rel="noopener noreferrer" sx={{ pb: 0.7, pl: 1 }}>
            <Typography component="span" sx={{ fontSize: "16px", mr: 0.25 }}>
              {community.name}
            </Typography>
            {baseUrl != actorInstanceBaseUrl && (
              <Typography component="span" sx={{ fontSize: "12px" }}>
                @{community.actor_id.split("/")[2]}
              </Typography>
            )}
          </Link>
        </Tooltip>
      </Typography>

      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {baseUrl != actorInstanceBaseUrl && <FediverseChipLink href={fediverseCommunityLink} size="sm" />}

        {community.removed && (
          <SquareChip
            color={"danger"}
            tooltip="Community is removed"
            iconOnly={<BlockIcon fontSize="small" />}
          />
        )}

        {community.deleted && (
          <SquareChip color={"danger"} tooltip="User is deleted" iconOnly={<DeleteIcon fontSize="small" />} />
        )}

        {isAdmin && (communityLoading || communityFetching) && (
          <CircularProgress
            size="sm"
            color="neutral"
            sx={{
              "--CircularProgress-size": "16px",
            }}
          />
        )}
        {isAdmin && communityError && (
          <SquareChip
            color={"danger"}
            tooltip="Failed to check community moderators"
            iconOnly={<PsychologyAltIcon fontSize="small" />}
          />
        )}
        {isAdmin && communityData && getLocalCommunityModeratorIndicator(communityData)}
      </Typography>
    </Box>
  );
}
