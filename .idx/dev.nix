{ pkgs, ... }:

{
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # Or "unstable", "stable-24.05", etc.

  # Use https://search.nixos.org/packages to find packages.
  packages = [
    pkgs.nodejs_20
  ];

  # Sets environment variables in the workspace.
  env = {};

  # Search for the starship package in nixpkgs
  # starship.enable = true;
}
